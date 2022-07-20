package staff

import (
	"database/sql"
	"fmt"
	"hotel/types"
	"hotel/utils"
)

// struct that represents a staff controller
type StaffController struct {
	// pointer to the database
	DB  *sql.DB
	cfg *utils.PasswordConfig
}

// function that returns a pointer to a new staff controller
func NewStaffController(db *sql.DB) *StaffController {
	return &StaffController{
		DB: db,
		cfg: &utils.PasswordConfig{
			Time:    1,
			Memory:  64 * 1024,
			Threads: 4,
			KeyLen:  32,
		},
	}
}

// function that logs in a staff member recibe the username and the password and returns a pointer to the staff member or an error
func (s *StaffController) Login(username string, password string) (*types.Staff, error) {
	// query the database for the staff member with the given username
	rows, err := s.DB.Query("SELECT * FROM usuario WHERE username = ?", username)
	if err != nil {
		return nil, utils.HttpError(500, "error logeando al usuario")
	}

	// check if the staff member exists
	if !rows.Next() {
		return nil, utils.HttpError(404, fmt.Sprintf("el usuario %s no existe", username))
	}

	// create a new staff member
	staff := &types.Staff{}

	// scan the database row into the staff member
	err = rows.Scan(&staff.Code, &staff.Name, &staff.Password, &staff.Role)
	if err != nil {
		return nil, utils.HttpError(500, "error leyendo al usuario")
	}

	// check if the password is correct
	ok, err := utils.ComparePasswords(password, staff.Password)
	if err != nil {
		return nil, err
	}

	if !ok {
		return nil, utils.HttpError(401, "contraseña incorrecta")
	}

	return staff, nil
}

// function that list all the current staff members in the database and returns a slice of pointers to the staff members or an error
func (s *StaffController) List() ([]*types.Staff, error) {
	// query the database for all the staff members
	rows, err := s.DB.Query("SELECT * FROM usuario")
	if err != nil {
		return nil, utils.HttpError(500, "error listando los usuarios")
	}

	// create a slice of pointers to staff members
	staff := []*types.Staff{}

	// scan the database rows into the staff members
	for rows.Next() {
		// create a new staff member
		member := &types.Staff{}

		// scan the database row into the staff member
		err = rows.Scan(&member.Code, &member.Name, &member.Password, &member.Role)
		if err != nil {
			return nil, utils.HttpError(500, "error leyendo los usuarios")
		}

		// append the staff member to the slice
		staff = append(staff, member)
	}

	return staff, nil
}

// function that creates a new staff member in the database, hash the password and returns a pointer to the staff member or an error
func (s *StaffController) Create(input *types.StaffInput) (*types.Staff, error) {
	// hash the password
	hashPwd, err := utils.GeneratePassword(s.cfg, input.Password)
	if err != nil {
		return nil, utils.HttpError(500, "error creando el usuario")
	}

	input.Password = hashPwd

	// insert the staff member into the database
	res, err := s.DB.Exec("INSERT INTO usuario (username, password, type) VALUES (?, ?, ?)", input.Name, input.Password, input.Role)
	if err != nil {
		return nil, utils.HttpError(500, "error creando el usuario")
	}

	// set the staff member code
	lastId, err := res.LastInsertId()
	if err != nil {
		return nil, utils.HttpError(500, "error creando el usuario")
	}

	staff := &types.Staff{
		Code: uint8(lastId),
		Name: input.Name,
		Role: input.Role,
	}

	return staff, nil
}

// function that delete a staff member from the database and returns an error
func (s *StaffController) Delete(code string) error {
	// delete the staff member from the database
	_, err := s.DB.Exec("DELETE FROM usuario WHERE codigo = ?", code)
	if err != nil {
		return utils.HttpError(500, "error eliminando el usuario")
	}

	return nil
}
