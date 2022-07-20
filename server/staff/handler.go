package staff

import (
	"database/sql"
	"hotel/types"
	"hotel/utils"

	"github.com/bradfitz/gomemcache/memcache"
	"github.com/labstack/echo/v4"
)

// type that defines a staff handler
type StaffHandler struct {
	controller *StaffController
	cache      *memcache.Client
}

// function that creates a new staff handler
func NewStaffHandler(db *sql.DB, cache *memcache.Client) *StaffHandler {
	return &StaffHandler{
		controller: NewStaffController(db),
		cache:      cache,
	}
}

// function that handles the request to create a new staff
func (h *StaffHandler) CreateStaff(c echo.Context) error {
	user := new(types.StaffInput)
	if err := c.Bind(user); err != nil {
		return utils.HttpError(400, "Error al obtener los datos")
	}

	staff, err := h.controller.Create(user)
	if err != nil {
		return err
	}

	h.cache.Delete("staff")
	return c.JSON(200, staff)
}

// function that handles the request to list all staff
func (h *StaffHandler) ListStaff(c echo.Context) error {
	data, err := utils.CheckCache(h.cache, "staff")
	if err != nil {
		return utils.HttpError(500, "Error al obtener los datos de la cache")
	}

	if data != nil {
		return c.JSON(200, data)
	}

	staff, err := h.controller.List()
	if err != nil {
		return err
	}

	return c.JSON(200, staff)
}

// function that handles the request to delete a staff member
func (h *StaffHandler) DeleteStaff(c echo.Context) error {
	id := c.Param("id")
	if id == "" {
		return utils.HttpError(400, "El id es requerido")
	}

	if err := h.controller.Delete(id); err != nil {
		return err
	}

	h.cache.Delete("staff")
	return c.JSON(200, map[string]string{"status": "success"})
}

// function that handles the request to login a staff member
func (h *StaffHandler) LoginStaff(c echo.Context) error {
	user := new(types.StaffInput)
	if err := c.Bind(user); err != nil {
		return utils.HttpError(400, "Error al obtener los datos")
	}

	staff, err := h.controller.Login(user.Name, user.Password)
	if err != nil {
		return err
	}

	utils.SetCookie(c, staff.Role)
	return c.JSON(200, staff)
}

// function that handles the request to logout a staff member
func (h *StaffHandler) LogoutStaff(c echo.Context) error {
	utils.DeleteCookie(c)
	return c.JSON(200, map[string]string{"message": "logout"})
}
