package rooms

import (
	"database/sql"
	"fmt"
	"hotel/types"
	"hotel/utils"
	"sync"

	"github.com/bradfitz/gomemcache/memcache"
	"github.com/labstack/echo/v4"
)

// type that defines a room handler
type RoomsHandler struct {
	controller *RoomsController
	cache      *memcache.Client
}

// function that creates a new room handler
func NewRoomsHandler(db *sql.DB, cahche *memcache.Client) *RoomsHandler {
	return &RoomsHandler{
		controller: NewRoomsController(db),
		cache:      cahche,
	}
}

// function that handles the request to create a new room
func (h *RoomsHandler) CreateRoom(c echo.Context) error {
	room := new(types.Room)
	if err := c.Bind(room); err != nil {
		return utils.HttpError(400, "Error al obtener los datos")
	}

	if err := h.controller.Create(room); err != nil {
		return err
	}

	h.cache.Delete("rooms")
	return c.JSON(200, room)
}

// function that handles the request to list all rooms
func (h *RoomsHandler) ListRooms(c echo.Context) error {
	data, err := utils.CheckCache(h.cache, "rooms")
	if err != nil {
		return utils.HttpError(500, "Error al obtener los datos")
	}

	if data != nil {
		return c.JSON(200, data)
	}

	rooms, err := h.controller.List()
	if err != nil {
		return err
	}

	if err := utils.SetCache(h.cache, "rooms", rooms); err != nil {
		return utils.HttpError(500, "Error al guardar los datos en cache")
	}

	return c.JSON(200, rooms)
}

// function that handles the request to filters rooms
func (h *RoomsHandler) FilterRooms(c echo.Context) error {
	filters := make(map[string]interface{})
	if err := c.Bind(&filters); err != nil {
		return utils.HttpError(400, "Error al obtener los datos")
	}

	rooms, err := h.controller.Filter(filters)
	if err != nil {
		return err
	}

	return c.JSON(200, rooms)
}

// function that handles the request to update a room
func (h *RoomsHandler) UpdateRoom(c echo.Context) error {
	room := new(types.Room)
	if err := c.Bind(room); err != nil {
		return utils.HttpError(400, "Error al obtener los datos")
	}

	if err := h.controller.Update(room); err != nil {
		return err
	}

	h.cache.Delete("rooms")
	return c.JSON(200, room)
}

// function that handles the request to delete a room
func (h *RoomsHandler) DeleteRoom(c echo.Context) error {
	id := c.Param("id")
	if id == "" {
		return utils.HttpError(400, "El id es requerido")
	}

	if err := h.controller.Delete(id); err != nil {
		return err
	}

	h.cache.Delete("rooms")
	return c.JSON(200, nil)
}

// function that handles the request to get a room details
func (h *RoomsHandler) GetRoom(c echo.Context) error {
	id := c.Param("id")
	if id == "" {
		return utils.HttpError(400, "El id es requerido")
	}

	// check if the room detail is cached
	data, err := utils.CheckCache(h.cache, fmt.Sprintf("room-%s", id))
	if err != nil {
		return utils.HttpError(500, "Error al obtener los datos")
	}

	if data != nil {
		return c.JSON(200, data)
	}

	// create a new wait group
	wg := new(sync.WaitGroup)
	detail := new(types.RoomDetail)
	var asyncErr error = nil
	wg.Add(2)

	go func() {
		asyncErr = h.controller.setClientsDetail(detail, id)
		wg.Done()
	}()

	go func() {
		asyncErr = h.controller.setObjectDetail(detail, id)
		wg.Done()
	}()

	wg.Wait()
	if asyncErr != nil {
		return err
	}

	if err := utils.SetCache(h.cache, fmt.Sprintf("room-%s", id), detail); err != nil {
		return utils.HttpError(500, "Error al guardar los datos en cache")
	}

	return c.JSON(200, detail)
}
