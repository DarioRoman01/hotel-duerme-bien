package records

import (
	"database/sql"
	"fmt"
	"hotel/types"
	"hotel/utils"
	"time"
)

// struct that represenst a record controller
type RecordsController struct {
	db *sql.DB
}

// function that returns a pointer to a new record handler
func NewRecordsController(db *sql.DB) *RecordsController {
	return &RecordsController{
		db: db,
	}
}

// function that returns a list of records with their respective clients or an error
func (r *RecordsController) List() ([]*types.RoomRecord, error) {
	// query the database for all the records
	rows, err := r.db.Query(`
		select hh.codigo, hh.activa, hh.codigo_habitacion, hh.fecha_asignacion, hh.fecha_termino,(
			select group_concat(nombre separator ',') from client_historial
			inner join cliente c on client_historial.rut_cliente = c.rut
			where client_historial.responsable = false and client_historial.codigo_historial = hh.codigo
		) as 'companions', (
			select nombre from client_historial
			inner join cliente c on client_historial.rut_cliente = c.rut
			where client_historial.responsable = true and client_historial.codigo_historial = hh.codigo
		) as 'responsible' from historial_habitacion hh
		where hh.eliminada = false group by hh.codigo;
	`)
	if err != nil {
		return nil, utils.HttpError(500, "Error al obtener los registros")
	}

	// create a slice of pointers to records
	records := []*types.RoomRecord{}

	// scan the database rows into the records slice
	for rows.Next() {
		record := &types.RoomRecord{}
		var companions *string
		err = rows.Scan(&record.Code, &record.Active, &record.Room, &record.StartDateTime, &record.EndDateTime, &companions, &record.Responsible)
		if err != nil {
			return nil, utils.HttpError(500, "Error al obtener los registros")
		}

		// set the companions of the record
		record.SetCompanions(companions)
		// append the record to the records slice
		records = append(records, record)
	}

	return records, nil
}

// function that validate before the creation or update of a record if the record is valid or not
func (r *RecordsController) validate(record *types.RoomRecord) error {
	// check if the record start date time is not empty if its empty set it to the current date time
	if record.StartDateTime == "" {
		record.StartDateTime = utils.GetCurrentDateTime()
	}

	// check if the start date time is greater than the finish date time
	layout := "2006-01-02 15:04"
	start, err := time.Parse(layout, record.StartDateTime)
	if err != nil {
		return utils.HttpError(400, "Error al validar la fecha de inicio")
	}

	finish, err := time.Parse(layout, record.EndDateTime)
	if err != nil {
		return utils.HttpError(400, "Error al validar la fecha de termino")
	}

	if start.After(finish) {
		return utils.HttpError(400, "La fecha de inicio debe ser menor a la fecha de termino")
	}

	// if the start date time is grater thant the current date time set the active to false else set it to true only if the record is new
	if record.Code == 0 { // we know that the record is new if the code is 0
		if start.After(time.Now()) {
			record.Active = false
		} else {
			record.Active = true
		}
	}

	// check if exists a record with same room and the finish date time is greater than the store finish date time
	rows, err := r.db.Query(`
		select hh.codigo, hh.activa, hh.codigo_habitacion, hh.fecha_asignacion, hh.fecha_termino from historial_habitacion hh
		where hh.codigo_habitacion = ? and hh.fecha_termino > ? and hh.eliminada = false;
	`, record.Room, record.EndDateTime)
	if err != nil {
		return utils.HttpError(500, "Error al validar el registro")
	}

	// if the rows is not empty return an error
	if rows.Next() {
		return utils.HttpError(400, "Ya existe un registro con la misma habitacion y la fecha de termino es mayor a la fecha de termino de otro registro")
	}

	return nil
}

// function that recibe a record id and check if it exists in the database or an error
func (r *RecordsController) Exists(code string) (bool, error) {
	// query the database for the record
	rows, err := r.db.Query(`
		select hh.codigo from historial_habitacion hh
		where hh.codigo = ?;
	`, code)
	if err != nil {
		return false, utils.HttpError(500, "Error al obtener el registro")
	}

	// if the rows is not empty return true else return false
	if rows.Next() {
		return true, nil
	}

	return false, nil
}

// function that creates a new record in the database or an error
func (r *RecordsController) Create(record *types.RoomRecord) error {
	// validate the record
	err := r.validate(record)
	if err != nil {
		return err
	}

	// insert the record into the database
	res, err := r.db.Exec(`
		insert into historial_habitacion (activa, codigo_habitacion, fecha_asignacion, fecha_termino, eliminada)
		values (?, ?, ?, ?, false);
	`, record.Active, record.Room, record.StartDateTime, record.EndDateTime)
	if err != nil {
		return utils.HttpError(500, "Error al crear el registro")
	}

	// get the last inserted id
	id, err := res.LastInsertId()
	if err != nil {
		return utils.HttpError(500, "Error al crear el registro")
	}

	// set the code of the record
	record.Code = uint8(id)

	// insert the responsible into the database
	_, err = r.db.Exec(`
		insert into client_historial (codigo_historial, rut_cliente, responsable)
		values (?, ?, ?);
	`, record.Code, record.Responsible, true)
	if err != nil {
		return utils.HttpError(500, "Error al asignar el registro")
	}

	// insert the companions of the record into the database if the len of the companions is greater than 0
	if len(record.Companions) > 0 {
		for _, companion := range record.Companions {
			_, err = r.db.Exec(`
				insert into client_historial (codigo_historial, rut_cliente, responsable)
				values (?, ?, ?);
			`, record.Code, companion, false)
			if err != nil {
				return utils.HttpError(500, "Error al asignar el registro")
			}
		}
	}

	return nil
}

// function that upodates a record in the database or an error only the active and end date time can be updated
func (r *RecordsController) Update(record *types.RoomRecord) error {
	// validate the record
	err := r.validate(record)
	if err != nil {
		return err
	}

	// update the record in the database
	_, err = r.db.Exec(`
		update historial_habitacion set activa = ?, fecha_termino = ?
		where codigo = ?;
	`, record.Active, record.EndDateTime, record.Code)
	if err != nil {
		return utils.HttpError(500, "Error al actualizar el registro")
	}

	return nil
}

// function that recibe a record id and check if the record is active or not returning a bool or an error
func (r *RecordsController) isActive(code string) (bool, error) {
	// query the database for the record
	rows, err := r.db.Query(`
		select hh.activa from historial_habitacion hh
		where hh.codigo = ? and hh.eliminada = false;
	`, code)
	if err != nil {
		return false, utils.HttpError(500, "Error al obtener el registro")
	}

	// if the rows is not empty return the active value else return false
	if rows.Next() {
		var active bool
		err = rows.Scan(&active)
		if err != nil {
			return false, utils.HttpError(500, "Error al obtener el registro")
		}

		return active, nil
	}

	return false, utils.HttpError(404, fmt.Sprintf("No existe el registro con el codigo %s", code))
}

// function that deletes a record from the database or an error
func (r *RecordsController) Delete(id string) error {
	// check if the record is active
	active, err := r.isActive(id)
	if err != nil {
		return err
	}

	// if the record is active return an error
	if active {
		return utils.HttpError(400, "El registro no puede ser eliminado porque esta activo")
	}

	// delete the record from the database
	_, err = r.db.Exec(`
		update historial_habitacion set eliminada = true
		where codigo = ?;
	`, id)
	if err != nil {
		return utils.HttpError(500, "Error al eliminar el registro")
	}

	return nil
}

// function that update all the records setting active to false if the finish date time is less than the current date time or an error
func (r *RecordsController) UpdateRecords() error {
	// update all the records setting active to false if the finish date time is less than the current date time
	_, err := r.db.Exec(`
		update historial_habitacion set activa = false
		where fecha_termino < now();
	`)

	if err != nil {
		return utils.HttpError(500, "Error al actualizar los registros")
	}

	return nil
}

/*
function that recibe a map of filters and build a query string
the map of filters have the following structure:
	{
		start: date time where the record starts,
		finish: date time where the record ends,
		room: room where the record is,
		state: state of the record (active or inactive),
	}
*/
func (r *RecordsController) BuildQuery(filters map[string]interface{}) string {
	// create the query string
	query := `
		select hh.codigo, hh.activa, hh.codigo_habitacion, hh.fecha_asignacion, hh.fecha_termino,(
			select group_concat(nombre separator ',') from client_historial
			inner join cliente c on client_historial.rut_cliente = c.rut
			where client_historial.responsable = false and client_historial.codigo_historial = hh.codigo
		) as 'companions', (
			select nombre from client_historial
			inner join cliente c on client_historial.rut_cliente = c.rut
			where client_historial.responsable = true and client_historial.codigo_historial = hh.codigo
		) as 'responsible' from historial_habitacion hh
		where hh.eliminada = false
	`
	// if the start date is set add it to the query
	if filters["start"] != nil {
		query += fmt.Sprintf(" and hh.fecha_asignacion >= '%v'", filters["start"])
	}

	// if the finish date is set add it to the query
	if filters["finish"] != nil {
		query += fmt.Sprintf(" and hh.fecha_termino <= '%v'", filters["finish"])
	}

	// if the room is set add it to the query
	if filters["room"] != nil {
		query += fmt.Sprintf(" and hh.codigo_habitacion = '%v'", filters["room"])
	}

	// if the state is set add it to the query
	if filters["state"] != nil {
		query += fmt.Sprintf(" and hh.activa = %v", filters["state"])
	}

	// add the grup by clause to the query
	query += " group by hh.codigo;"
	return query
}

// function called Filter that recibe a map of filters and return a slice of records or an error
func (r *RecordsController) Filter(filters map[string]interface{}) ([]*types.RoomRecord, error) {
	// create the query string
	query := r.BuildQuery(filters)

	// execute the query
	rows, err := r.db.Query(query)
	if err != nil {
		return nil, utils.HttpError(500, "Error al filtrar los registros")
	}

	// create a slice of pointers to records
	records := []*types.RoomRecord{}

	// scan the database rows into the records slice
	for rows.Next() {
		record := &types.RoomRecord{}
		var companions *string
		err = rows.Scan(&record.Code, &record.Active, &record.Room, &record.StartDateTime, &record.EndDateTime, &companions, &record.Responsible)
		if err != nil {
			return nil, utils.HttpError(500, "Error al filtrar los registros")
		}

		// set the companions of the record
		record.SetCompanions(companions)
		// append the record to the records slice
		records = append(records, record)
	}

	return records, nil
}
