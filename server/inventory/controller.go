package inventory

import (
	"database/sql"
	"fmt"
	"hotel/types"
	"hotel/utils"
)

// struct that define a inventory controller
type InventoryController struct {
	db *sql.DB
}

// function that returns a pointer to a new inventory controller
func NewInventoryController(db *sql.DB) *InventoryController {
	return &InventoryController{
		db: db,
	}
}

// function that returns a list of room objects or an error
func (i *InventoryController) List() ([]*types.RoomObject, error) {
	// query the database for all the room objects
	rows, err := i.db.Query(`
		SELECT oh.codigo_habitacion, oh.codigo, oh.estado, oh.tipo FROM objeto_habitacion as oh
		inner join habitacion h on oh.codigo_habitacion = h.codigo
		where h.eliminada = false;
	`)

	if err != nil {
		return nil, utils.HttpError(500, "ocurrio un error al obtener los objetos de la habitacion")
	}

	// create a slice of pointers to room objects
	roomObjects := []*types.RoomObject{}

	// scan the database rows into the room objects slice
	for rows.Next() {
		roomObject := &types.RoomObject{}
		err = rows.Scan(&roomObject.Room, &roomObject.Code, &roomObject.State, &roomObject.Type)
		if err != nil {
			return nil, utils.HttpError(500, "ocurrio un error al obtener los objetos de la habitacion")
		}

		roomObjects = append(roomObjects, roomObject)
	}

	return roomObjects, nil
}

// function that create a new room object in the database and returns an error
func (i *InventoryController) Create(roomObject *types.RoomObject) error {
	// insert the room object into the database
	res, err := i.db.Exec(`
		INSERT INTO objeto_habitacion (codigo_habitacion, estado, tipo)
		VALUES (?, ?, ?);
	`, roomObject.Room, roomObject.State, roomObject.Type)
	if err != nil {
		return utils.HttpError(500, "ocurrio un error al crear el objeto de la habitacion")
	}

	lastId, err := res.LastInsertId()
	if err != nil {
		return err
	}

	roomObject.Code = uint64(lastId)
	return err
}

// function that update a room object in the database and returns an error
func (i *InventoryController) Update(roomObject *types.RoomObject) error {
	// update the room object in the database
	_, err := i.db.Exec(`
		UPDATE objeto_habitacion SET estado = ?, tipo = ?, codigo_habitacion = ?
		WHERE codigo = ?;
	`, roomObject.State, roomObject.Type, roomObject.Room, roomObject.Code)
	if err != nil {
		return utils.HttpError(500, "ocurrio un error al actualizar el objeto de la habitacion")
	}

	return nil
}

// function that delete a room object in the database and returns an error
func (i *InventoryController) Delete(id string) error {
	// check if exists the room object with the given id
	rows, err := i.db.Query(`
		SELECT codigo FROM objeto_habitacion WHERE codigo = ?;
	`, id)

	if err != nil {
		return utils.HttpError(500, "ocurrio un error al eliminar el objeto de la habitacion")
	}

	// if the room object does not exist
	if !rows.Next() {
		return utils.HttpError(404, fmt.Sprintf("no existe el objeto de la habitacion con id %v", id))
	}

	rows.Close()

	// delete the room object from the database
	_, err = i.db.Exec(`
		DELETE FROM objeto_habitacion WHERE codigo = ?;
	`, id)
	if err != nil {
		return utils.HttpError(500, "ocurrio un error al eliminar el objeto de la habitacion")
	}

	return nil
}

/*
function that recibe a map of filters and returns a query string
the map of filters has the following structure:
{
	"room": "room code",
	"min": "minimum  state value of the room object",
	"max": "maximum state value of the room object",
	"type": "object type",
}
*/
func (i *InventoryController) BuildQuery(filters map[string]interface{}) string {
	// create a query string
	query := `
		SELECT oh.codigo_habitacion, oh.codigo, oh.estado, oh.tipo FROM objeto_habitacion as oh
		inner join habitacion h on oh.codigo_habitacion = h.codigo
		where h.eliminada = false
	`

	// if the room filter is set
	if filters["room"] != nil {
		query += fmt.Sprintf(" AND oh.codigo_habitacion = '%v'", filters["room"])
	}

	// if the min filter is set
	if filters["min"] != nil {
		query += fmt.Sprintf(" AND oh.estado >= %v", filters["min"])
	}

	// if the max filter is set
	if filters["max"] != nil {
		query += fmt.Sprintf(" AND oh.estado <= %v", filters["max"])
	}

	// if the type filter is set
	if filters["type"] != nil {
		query += fmt.Sprintf(" AND oh.tipo = '%v'", filters["type"])
	}

	return query
}

// function called Filter that recibe a map of filters and returns a list of room objects or an error
func (i *InventoryController) Filter(filters map[string]interface{}) ([]*types.RoomObject, error) {
	// query the database for all the room objects
	rows, err := i.db.Query(i.BuildQuery(filters))
	if err != nil {
		return nil, utils.HttpError(500, "ocurrio un error al filtrar los objetos de la habitacion")
	}

	// create a slice of pointers to room objects
	roomObjects := []*types.RoomObject{}

	// scan the database rows into the room objects slice
	for rows.Next() {
		roomObject := &types.RoomObject{}
		err = rows.Scan(&roomObject.Room, &roomObject.Code, &roomObject.State, &roomObject.Type)
		if err != nil {
			return nil, utils.HttpError(500, "ocurrio un error al filtrar los objetos de la habitacion")
		}

		roomObjects = append(roomObjects, roomObject)
	}

	return roomObjects, nil
}
