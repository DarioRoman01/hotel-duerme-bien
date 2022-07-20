package main

import (
	"fmt"
	"hotel/clients"
	"hotel/inventory"
	"hotel/middlewares"
	"hotel/records"
	"hotel/rooms"
	"hotel/sql"
	"hotel/staff"
	"os"

	"github.com/bradfitz/gomemcache/memcache"
	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func init() {
	if err := godotenv.Load(); err != nil {
		panic(err)
	}
}

func main() {
	db := sql.Connect()
	cache := memcache.New(os.Getenv("cache_url"))
	staffHandler := staff.NewStaffHandler(db, cache)
	roomHandler := rooms.NewRoomsHandler(db, cache)
	clientHandler := clients.NewClientsHandler(db, cache)
	inventoryHandler := inventory.NewInventoryHandler(db, cache)
	recordsHandler := records.NewRecordsHandler(db, cache)

	e := echo.New()
	defer db.Close()

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     []string{"*"},
		AllowCredentials: true,
	}))
	e.Use(middlewares.IsLoggedIn)

	e.GET("/", func(c echo.Context) error {
		return c.String(200, "Hello, World!")
	})

	// staff routes
	e.GET("/staff", staffHandler.ListStaff)
	e.POST("/staff/create", staffHandler.CreateStaff)
	e.POST("/login", staffHandler.LoginStaff)
	e.GET("/logout", staffHandler.LogoutStaff)
	e.DELETE("/staff/:id", staffHandler.DeleteStaff)

	// clients routes
	e.GET("/clients", clientHandler.ListClients)
	e.POST("/clients", clientHandler.FilterClients)
	e.PATCH("/clients", clientHandler.UpdateClient)
	e.DELETE("/clients/:rut", clientHandler.DeleteClient)
	e.POST("/clients/create", clientHandler.CreateClient)

	// rooms routes
	e.GET("/rooms", roomHandler.ListRooms)
	e.POST("/rooms", roomHandler.FilterRooms)
	e.DELETE("/rooms/:id", roomHandler.DeleteRoom)
	e.GET("/rooms/:id", roomHandler.GetRoom)
	e.PATCH("/rooms", roomHandler.UpdateRoom)
	e.POST("/rooms/create", roomHandler.CreateRoom)

	// inventory routes
	e.GET("/inventory", inventoryHandler.ListRoomObjects)
	e.POST("/inventory", inventoryHandler.FilterRoomObjects)
	e.PATCH("/inventory", inventoryHandler.UpdateRoomObject)
	e.DELETE("/inventory/:id", inventoryHandler.DeleteRoomObject)
	e.POST("/inventory/create", inventoryHandler.CreateRoomObject)

	// records routes
	e.GET("/records", recordsHandler.ListRecords)
	e.POST("/records", recordsHandler.FilterRecords)
	e.PATCH("/records", recordsHandler.UpdateRecord)
	e.PATCH("/records/update", recordsHandler.UpdateAllRecords)
	e.POST("/records/create", recordsHandler.CreateRecord)
	e.DELETE("/records/:id", recordsHandler.DeleteRecord)

	e.Logger.Fatal(e.Start(fmt.Sprintf(":%s", os.Getenv("port"))))
}
