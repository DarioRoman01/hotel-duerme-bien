package inventory

import (
	"database/sql"
	"hotel/types"
	"hotel/utils"

	"github.com/bradfitz/gomemcache/memcache"
	"github.com/labstack/echo/v4"
)

// type that defines an inventory handler
type InventoryHandler struct {
	controller *InventoryController
	cache      *memcache.Client
}

// function that creates a new inventory handler
func NewInventoryHandler(db *sql.DB, cache *memcache.Client) *InventoryHandler {
	return &InventoryHandler{
		controller: NewInventoryController(db),
		cache:      cache,
	}
}

// function that handles the request to create a new room object in the database
func (h *InventoryHandler) CreateRoomObject(c echo.Context) error {
	roomObject := new(types.RoomObject)
	if err := c.Bind(roomObject); err != nil {
		return utils.HttpError(400, "Error al obtener los datos")
	}

	if err := h.controller.Create(roomObject); err != nil {
		return err
	}

	h.cache.Delete("roomObjects")
	return c.JSON(200, roomObject)
}

// function that handles the request to list all room objects in the database
func (h *InventoryHandler) ListRoomObjects(c echo.Context) error {
	data, err := utils.CheckCache(h.cache, "roomObjects")
	if err != nil {
		return utils.HttpError(500, "Error al obtener los datos de la cache")
	}

	if data != nil {
		return c.JSON(200, data)
	}

	roomObjects, err := h.controller.List()
	if err != nil {
		return err
	}

	if err = utils.SetCache(h.cache, "roomObjects", roomObjects); err != nil {
		return utils.HttpError(500, "Error al guardar los datos de la cache")
	}

	return c.JSON(200, roomObjects)
}

// function that handles the request to filters room objects
func (h *InventoryHandler) FilterRoomObjects(c echo.Context) error {
	filters := make(map[string]interface{})
	if err := c.Bind(&filters); err != nil {
		return utils.HttpError(400, "Error al obtener los datos")
	}

	roomObjects, err := h.controller.Filter(filters)
	if err != nil {
		return err
	}

	return c.JSON(200, roomObjects)
}

// function to delete a room object from the database
func (h *InventoryHandler) DeleteRoomObject(c echo.Context) error {
	id := c.Param("id")
	if id == "" {
		return utils.HttpError(400, "El id es requerido")
	}

	if err := h.controller.Delete(id); err != nil {
		return err
	}

	h.cache.Delete("roomObjects")
	return c.JSON(200, nil)
}

// function that handles the request to update a room object
func (h *InventoryHandler) UpdateRoomObject(c echo.Context) error {
	roomObject := new(types.RoomObject)
	if err := c.Bind(roomObject); err != nil {
		return utils.HttpError(400, "Error al obtener los datos")
	}

	if err := h.controller.Update(roomObject); err != nil {
		return err
	}

	h.cache.Delete("roomObjects")
	return c.JSON(200, roomObject)
}
