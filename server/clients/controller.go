package clients

import (
	"database/sql"
	"hotel/types"
	"hotel/utils"
)

// struct that define a clients controller
type ClientsController struct {
	db *sql.DB
}

// function that returns a pointer to a new clients handler
func NewClientsController(db *sql.DB) *ClientsController {
	return &ClientsController{
		db: db,
	}
}

// function that returns a list of clients or an error
func (c *ClientsController) List() ([]*types.Client, error) {
	// query the database for all the clients
	rows, err := c.db.Query(`
		SELECT c.rut, c.nombre, c.reputacion, ch.responsable, hh.codigo_habitacion FROM client_historial ch
		INNER JOIN historial_habitacion hh on ch.codigo_historial = hh.codigo AND hh.activa = true
		RIGHT JOIN cliente c on c.rut = ch.rut_cliente
		WHERE c.eliminado = false;
	`)

	if err != nil {
		return nil, utils.HttpError(500, "ocurrio un error al obtener los clientes")
	}

	defer rows.Close()

	// create a slice of pointers to clients
	clients := []*types.Client{}

	// scan the database rows into the clients slice
	for rows.Next() {
		client := &types.Client{}
		var responsible *uint8
		var room *string
		err = rows.Scan(&client.Rut, &client.Name, &client.Reputation, &responsible, &room)
		if err != nil {
			return nil, utils.HttpError(500, "ocurrio un error al obtener los clientes")
		}

		client.SetResponsibleAndRoom(responsible, room)
		clients = append(clients, client)
	}

	return clients, nil
}

// function that create a new client in the database and returns an error
func (c *ClientsController) Create(client *types.Client) error {
	// insert the client into the database
	_, err := c.db.Exec(`
		INSERT INTO cliente (rut, nombre, reputacion, eliminado)
		VALUES (?, ?, 100, false);
	`, client.Rut, client.Name)
	if err != nil {
		return utils.HttpError(500, "ocurrio un error al crear el cliente")
	}

	client.SetResponsibleAndRoom(nil, nil)
	client.Reputation = 100
	return nil
}

// function that update a client in the database and returns a pointer to the client or an error
func (c *ClientsController) Update(client *types.Client) error {
	// update the client in the database
	_, err := c.db.Exec(`
		UPDATE cliente SET nombre = ?, reputacion = ? WHERE rut = ?;
	`, client.Name, client.Reputation, client.Rut)
	if err != nil {
		return utils.HttpError(500, "ocurrio un error al actualizar el cliente")
	}

	return nil
}

// function that recibe a rut and validate that the client with the given rut can be deleted
func (c *ClientsController) canDelete(rut string) error {
	// query the database for the client
	rows, err := c.db.Query(`
		select hh.activa from cliente c
		left join client_historial ch on c.rut = ch.rut_cliente
		left join historial_habitacion hh on ch.codigo_historial = hh.codigo
		where c.rut = ? and c.eliminado = false;
	`, rut)
	if err != nil {
		return utils.HttpError(500, "ocurrio un error al obtener los clientes")
	}

	defer rows.Close()

	// validate that the client exists
	if !rows.Next() {
		return utils.HttpError(404, "el cliente no existe")
	}

	// validate that the client is not hosted
	var active bool
	err = rows.Scan(&active)
	if err != nil {
		return utils.HttpError(500, "ocurrio un error al obtener los clientes")
	}

	if active {
		return utils.HttpError(400, "el cliente no puede ser eliminado porque esta hospedado")
	}

	return nil
}

// function that delete a client in the database and returns a pointer to the client or an error
func (c *ClientsController) Delete(rut string) error {
	// validate that exists a client with the given rut and is not hosted
	err := c.canDelete(rut)
	if err != nil {
		return err
	}

	// delete the client from the database
	_, err = c.db.Exec(`
		UPDATE cliente SET eliminado = true WHERE rut = ?;
	`, rut)
	if err != nil {
		return utils.HttpError(500, "ocurrio un error al eliminar el cliente")
	}

	return nil
}

// function that recibe a map of filters and add them to the query if the value is not nil and return a slice of pointers of clients
func (c *ClientsController) Filter(filters map[string]interface{}) ([]*types.Client, error) {
	// create a query string
	query := `
		SELECT c.rut, c.nombre, c.reputacion, ch.responsable, hh.codigo_habitacion FROM client_historial ch
		INNER JOIN historial_habitacion hh on ch.codigo_historial = hh.codigo AND hh.activa = true
		RIGHT JOIN cliente c on c.rut = ch.rut_cliente
		WHERE c.eliminado = false
	`

	// if the name is in the filters add them to the query
	if filters["name"] != nil {
		query += " AND c.nombre like '%" + filters["name"].(string) + "%'"
	}

	// query the database for all the clients
	rows, err := c.db.Query(query)
	if err != nil {
		return nil, utils.HttpError(500, "ocurrio un error al filtrar los clientes")
	}

	defer rows.Close()

	// create a slice of pointers to clients
	clients := []*types.Client{}

	// scan the database rows into the clients slice
	for rows.Next() {
		client := &types.Client{}
		var responsible *uint8
		var room *string
		err = rows.Scan(&client.Rut, &client.Name, &client.Reputation, &responsible, &room)
		if err != nil {
			return nil, utils.HttpError(500, "ocurrio un error al filtrar los clientes")
		}

		client.SetResponsibleAndRoom(responsible, room)

		// check if the client is valid according to the filters
		if filters["hosted"] != nil {
			if filters["hosted"].(bool) {
				if client.Type == "No esta hospedado actualmente" {
					continue
				}
			} else {
				if client.Type != "No esta hospedado actualmente" {
					continue
				}
			}
		}

		if filters["room"] != nil {
			if client.Room != filters["room"].(string) {
				continue
			}
		}

		clients = append(clients, client)
	}

	return clients, nil
}
