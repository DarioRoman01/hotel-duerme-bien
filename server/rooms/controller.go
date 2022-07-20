package rooms

import (
	"database/sql"
	"fmt"
	"hotel/types"
	"hotel/utils"
	"math"
)

// struct that define a rooms controller
type RoomsController struct {
	db *sql.DB
}

// function that returns a pointer to a new rooms handler
func NewRoomsController(db *sql.DB) *RoomsController {
	return &RoomsController{
		db: db,
	}
}

// function that returns a list of rooms or an error
func (r *RoomsController) List() ([]*types.Room, error) {
	// query the database for all the rooms
	rows, err := r.db.Query(`
		SELECT h.codigo, h.capacidad, h.orientacion, h.estado, AVG(oh.estado) as 'estado' FROM habitacion as h
		LEFT JOIN objeto_habitacion AS oh ON oh.codigo_habitacion = h.codigo
		WHERE eliminada = false
		group by h.codigo;
	`)

	if err != nil {
		return nil, utils.HttpError(500, "Error al obtener las habitaciones")
	}

	// create a slice of pointers to rooms
	rooms := []*types.Room{}

	// scan the database rows into the rooms slice
	for rows.Next() {
		room := &types.Room{}
		var inventoryState *float64
		err = rows.Scan(&room.Code, &room.Capacity, &room.Orientation, &room.Occupancy, &inventoryState)
		if err != nil {
			return nil, utils.HttpError(500, "Error al obtener las habitaciones")
		}

		if inventoryState != nil {
			room.InventoryState = float32(math.Round(*inventoryState*2) / 2)
		}

		rooms = append(rooms, room)
	}

	return rooms, nil
}

// function that create a new room in the database and returns a pointer to the room or an error
func (r *RoomsController) Create(room *types.Room) error {
	// insert the room into the database
	_, err := r.db.Exec(`
		INSERT INTO habitacion (codigo, capacidad, orientacion, eliminada)
		VALUES (?, ?, ?, false);
	`, room.Code, room.Capacity, room.Orientation)
	if err != nil {
		fmt.Println(err)
		return utils.HttpError(500, "Error al crear la habitacion")
	}

	room.InventoryState = 0.0
	room.Occupancy = "libre"
	return nil
}

// function that update a room in the database and returns a pointer to the room or an error
func (r *RoomsController) Update(room *types.Room) error {
	// update the room in the database
	_, err := r.db.Exec(`
		UPDATE habitacion SET capacidad = ?, orientacion = ?, estado = ? WHERE codigo = ?;
	`, room.Capacity, room.Orientation, room.Occupancy, room.Code)
	if err != nil {
		return utils.HttpError(500, "Error al actualizar la habitacion")
	}

	return nil
}

func (r *RoomsController) BuildQuery(filters map[string]interface{}) string {
	// create the query string
	query := `
		SELECT h.codigo, h.capacidad, h.orientacion, h.estado, AVG(oh.estado) as 'estado_i' FROM habitacion as h
		LEFT JOIN objeto_habitacion AS oh ON oh.codigo_habitacion = h.codigo
		WHERE eliminada = false
	`

	// iterate over the filters map
	for key, value := range filters {
		// add the filter to the query string
		if value != nil && key != "min" && key != "max" {
			query += fmt.Sprintf(" AND h.%s = '%v' ", key, value)
		}
	}

	// add the group by clause
	query += " GROUP BY h.codigo"
	if filters["max"] != nil || filters["min"] != nil {
		if filters["max"] != nil && filters["min"] != nil {
			query += fmt.Sprintf(" HAVING estado_i BETWEEN %v AND %v ", filters["min"], filters["max"])
		} else if filters["min"] != nil {
			query += fmt.Sprintf(" HAVING estado_i >= %v ", filters["min"])
		} else {
			query += fmt.Sprintf(" HAVING estado_i <= %v ", filters["max"])
		}
	}

	return query
}

// function that recibe a map of filters and adds them to the query if the value is not nil and return a slice of pointers to rooms
func (r *RoomsController) Filter(filters map[string]interface{}) ([]*types.Room, error) {
	// create the query string
	query := r.BuildQuery(filters)

	// query the database for all the rooms
	rows, err := r.db.Query(query)

	if err != nil {
		return nil, utils.HttpError(500, "Error al filtrar las habitaciones")
	}

	// create a slice of pointers to rooms
	rooms := []*types.Room{}

	// scan the database rows into the rooms slice
	for rows.Next() {
		room := &types.Room{}
		var inventoryState *float64
		err = rows.Scan(&room.Code, &room.Capacity, &room.Orientation, &room.Occupancy, &inventoryState)
		if err != nil {
			return nil, utils.HttpError(500, "Error al filtrar las habitaciones")
		}

		if inventoryState != nil {
			room.InventoryState = float32(math.Round(*inventoryState*2) / 2)
		}

		rooms = append(rooms, room)
	}

	return rooms, nil
}

// function that delete a room setting eliminada to true in the database and returns an error
func (r *RoomsController) Delete(id string) error {
	// validate that the room is not in use
	rows, err := r.db.Query(`
		SELECT codigo FROM habitacion WHERE codigo = ? and (estado = 'ocupada' or estado = 'reservada') and eliminada = false;
	`, id)
	if err != nil {
		return utils.HttpError(500, "Error al eliminar la habitacion")
	}

	if rows.Next() {
		return utils.HttpError(400, "La habitacion esta ocupada")
	}

	// delete the room from the database
	_, err = r.db.Exec(`
		UPDATE habitacion SET eliminada = true WHERE codigo = ?;
	`, id)
	if err != nil {
		return utils.HttpError(500, "Error al eliminar la habitacion")
	}

	return nil
}

// function that return the detail of a room
func (r *RoomsController) Detail(id string) (*types.RoomDetail, error) {
	// create a pointer to a room detail
	detail := new(types.RoomDetail)

	// query the database for the room objects
	rows, err := r.db.Query("SELECT DISTINCT tipo, COUNT(tipo), AVG(estado) FROM objeto_habitacion WHERE codigo_habitacion = ? GROUP BY tipo;", id)
	if err != nil {
		return nil, utils.HttpError(500, "Error al obtener la habitacion")
	}

	// scan the database rows into the detail
	for rows.Next() {
		obj := new(types.RoomDetailObj)
		err = rows.Scan(&obj.Type, &obj.Total, &obj.State)
		if err != nil {
			return nil, utils.HttpError(500, "Error al obtener la habitacion")
		}

		detail.Objects = append(detail.Objects, *obj)
	}

	rows.Close()

	// query the database for the room clients
	rows, err = r.db.Query(`
		SELECT c.rut, c.nombre, c.reputacion, ch.responsable FROM historial_habitacion
        INNER JOIN client_historial ch on historial_habitacion.codigo = ch.codigo_historial
        INNER JOIN cliente c on ch.rut_cliente = c.rut
        WHERE codigo_habitacion = ? AND activa = TRUE AND eliminada = FALSE;
	`, id)

	if err != nil {
		return nil, utils.HttpError(500, "Error al obtener la habitacion")
	}

	// scan the database rows into the detail
	for rows.Next() {
		client := new(types.Client)
		var responsible *uint8
		err = rows.Scan(&client.Rut, &client.Name, &client.Reputation, &responsible)
		if err != nil {
			return nil, utils.HttpError(500, "Error al obtener la habitacion")
		}

		client.SetResponsibleAndRoom(responsible, nil)
		detail.Clients = append(detail.Clients, *client)
	}

	rows.Close()

	return detail, nil
}

func (r *RoomsController) setClientsDetail(detail *types.RoomDetail, id string) error {
	rows, err := r.db.Query(`
		SELECT c.rut, c.nombre, c.reputacion, ch.responsable FROM historial_habitacion
        INNER JOIN client_historial ch on historial_habitacion.codigo = ch.codigo_historial
        INNER JOIN cliente c on ch.rut_cliente = c.rut
        WHERE codigo_habitacion = ? AND activa = TRUE AND eliminada = FALSE;
	`, id)

	if err != nil {
		return utils.HttpError(500, "Error al obtener la habitacion")
	}

	// scan the database rows into the detail
	for rows.Next() {
		client := new(types.Client)
		var responsible *uint8
		err = rows.Scan(&client.Rut, &client.Name, &client.Reputation, &responsible)
		if err != nil {
			return utils.HttpError(500, "Error al obtener la habitacion")
		}

		client.SetResponsibleAndRoom(responsible, nil)
		detail.Clients = append(detail.Clients, *client)
	}

	rows.Close()
	return nil
}

func (r *RoomsController) setObjectDetail(detail *types.RoomDetail, id string) error {
	rows, err := r.db.Query(`
		SELECT tipo, COUNT(tipo), AVG(estado) FROM objeto_habitacion WHERE codigo_habitacion = ? GROUP BY tipo;
	`, id)
	if err != nil {
		return utils.HttpError(500, "Error al obtener la habitacion")
	}

	// scan the database rows into the detail
	for rows.Next() {
		obj := new(types.RoomDetailObj)
		err = rows.Scan(&obj.Type, &obj.Total, &obj.State)
		if err != nil {
			return utils.HttpError(500, "Error al obtener la habitacion")
		}

		detail.Objects = append(detail.Objects, *obj)
	}

	rows.Close()
	return nil
}
