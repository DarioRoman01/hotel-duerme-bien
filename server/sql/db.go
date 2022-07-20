package sql

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/go-sql-driver/mysql"
)

// function that connects to the database and return a pointer to the database
func Connect() *sql.DB {
	// connect to the database
	db, err := sql.Open(
		"mysql",
		fmt.Sprintf("%s:%s@tcp(%s:%s)/%s",
			os.Getenv("db_username"),
			os.Getenv("db_password"),
			os.Getenv("db_host"),
			os.Getenv("db_port"),
			os.Getenv("db_name")),
	)

	if err != nil {
		panic(err.Error())
	}

	// check if the database is connected
	err = db.Ping()
	if err != nil {
		panic(err.Error())
	}

	return db
}
