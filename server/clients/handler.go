package clients

import (
	"database/sql"
	"hotel/types"
	"hotel/utils"

	"github.com/bradfitz/gomemcache/memcache"
	"github.com/labstack/echo/v4"
)

// type that defines a client handler
type ClientsHandler struct {
	controller *ClientsController
	cache      *memcache.Client
}

// function that creates a new client handler
func NewClientsHandler(db *sql.DB, cache *memcache.Client) *ClientsHandler {
	return &ClientsHandler{
		controller: NewClientsController(db),
		cache:      cache,
	}
}

// function that handles the request to create a new client
func (h *ClientsHandler) CreateClient(c echo.Context) error {
	client := new(types.Client)
	if err := c.Bind(client); err != nil {
		return utils.HttpError(400, "No se pudo leer los datos enviados")
	}

	err := h.controller.Create(client)
	if err != nil {
		return err
	}

	h.cache.Delete("clients")
	return c.JSON(200, client)
}

// function that handles the request to list all clients
func (h *ClientsHandler) ListClients(c echo.Context) error {
	data, err := utils.CheckCache(h.cache, "clients")
	if err != nil {
		return utils.HttpError(500, "Error al obtener los datos de la cache")
	}

	if data != nil {
		return c.JSON(200, data)
	}

	clients, err := h.controller.List()
	if err != nil {
		return err
	}

	err = utils.SetCache(h.cache, "clients", clients)
	if err != nil {
		return utils.HttpError(500, "Error al guardar los datos de la cache")
	}

	return c.JSON(200, clients)
}

// function that handles the request to filters clients
func (h *ClientsHandler) FilterClients(c echo.Context) error {
	filters := make(map[string]interface{})
	if err := c.Bind(&filters); err != nil {
		return utils.HttpError(400, "Error al obtener los datos")
	}

	clients, err := h.controller.Filter(filters)
	if err != nil {
		return err
	}

	return c.JSON(200, clients)
}

// function that handles the request to delete a client
func (h *ClientsHandler) DeleteClient(c echo.Context) error {
	rut := c.Param("rut")
	if rut == "" {
		return utils.HttpError(400, "el rut es requerido")
	}

	err := h.controller.Delete(rut)
	if err != nil {
		return err
	}

	h.cache.Delete("clients")
	return c.JSON(200, map[string]bool{"success": true})
}

// function that handles the request to update a client
func (h *ClientsHandler) UpdateClient(c echo.Context) error {
	client := new(types.Client)
	if err := c.Bind(client); err != nil {
		return utils.HttpError(400, "Error al obtener los datos")
	}

	err := h.controller.Update(client)
	if err != nil {
		return err
	}

	h.cache.Delete("clients")
	return c.JSON(200, client)
}
