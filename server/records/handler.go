package records

import (
	"database/sql"
	"hotel/types"
	"hotel/utils"
	"strconv"

	"github.com/bradfitz/gomemcache/memcache"
	"github.com/labstack/echo/v4"
)

// type that defines a record handler
type RecordsHandler struct {
	controller *RecordsController
	cache      *memcache.Client
}

// function that creates a new record handler
func NewRecordsHandler(db *sql.DB, cache *memcache.Client) *RecordsHandler {
	return &RecordsHandler{
		controller: NewRecordsController(db),
		cache:      cache,
	}
}

// function that handles the request to create a new record
func (h *RecordsHandler) CreateRecord(c echo.Context) error {
	record := new(types.RoomRecord)
	if err := c.Bind(record); err != nil {
		return utils.HttpError(400, "Error al obtener los datos")
	}

	if err := h.controller.Create(record); err != nil {
		return err
	}

	h.cache.Delete("records")
	return c.JSON(200, record)
}

// function that handles the request to list all records
func (h *RecordsHandler) ListRecords(c echo.Context) error {
	data, err := utils.CheckCache(h.cache, "records")
	if err != nil {
		return utils.HttpError(500, "Error al obtener los datos de la cache")
	}

	if data != nil {
		return c.JSON(200, data)
	}

	records, err := h.controller.List()
	if err != nil {
		return err
	}

	if err = utils.SetCache(h.cache, "records", records); err != nil {
		return utils.HttpError(500, "Error al guardar los datos de la cache")
	}
	return c.JSON(200, records)
}

// function that handles the request to filters records
func (h *RecordsHandler) FilterRecords(c echo.Context) error {
	filters := make(map[string]interface{})
	if err := c.Bind(&filters); err != nil {
		return utils.HttpError(400, "Error al obtener los datos")
	}

	records, err := h.controller.Filter(filters)
	if err != nil {
		return err
	}

	return c.JSON(200, records)
}

// function that handles the request to update a record
func (h *RecordsHandler) UpdateRecord(c echo.Context) error {
	record := new(types.RoomRecord)
	if err := c.Bind(record); err != nil {
		return utils.HttpError(400, "Error al obtener los datos")
	}

	exists, err := h.controller.Exists(strconv.Itoa(int(record.Code)))
	if err != nil {
		return err
	}

	if !exists {
		return c.JSON(404, map[string]string{"message": "Record not found"})
	}

	if err = h.controller.Update(record); err != nil {
		return err
	}

	h.cache.Delete("records")
	return c.JSON(200, record)
}

// function that handles the request to delete a record
func (h *RecordsHandler) DeleteRecord(c echo.Context) error {
	id := c.Param("id")
	if id == "" {
		return utils.HttpError(400, "el id es requerido")
	}

	if err := h.controller.Delete(id); err != nil {
		return err
	}

	h.cache.Delete("records")
	return c.JSON(200, map[string]bool{"success": true})
}

// function that handles the request to update all records
func (h *RecordsHandler) UpdateAllRecords(c echo.Context) error {
	if err := h.controller.UpdateRecords(); err != nil {
		return err
	}

	h.cache.Delete("records")
	return c.JSON(200, map[string]string{"status": "success"})
}
