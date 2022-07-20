package types

import "strings"

// type that represents a staff member with a name and a role
type Staff struct {
	//unique code of the staff member
	Code uint8 `json:"code"`
	// name of the staff member
	Name string `json:"name"`
	// role of the staff member
	Role string `json:"role"`
	// password of the staff member
	Password string `json:"-"`
}

// type that represents the staff member with a name and a password
type StaffInput struct {
	// name of the staff member
	Name string `json:"name"`
	// password of the staff member
	Password string `json:"password"`
	// role of the staff member
	Role string `json:"role"`
}

// type that represents a client with rut, name, reputation and the current room he is in
type Client struct {
	// rut of the client
	Rut string `json:"rut"`
	// name of the client
	Name string `json:"name"`
	// reputation of the client
	Reputation uint8 `json:"reputation"`
	// the client is hosted in the hotel
	Type string `json:"type"`
	// current room of the client
	Room string `json:"room"`
}

// function that set type and room of a client
func (c *Client) SetResponsibleAndRoom(responsible *uint8, room *string) {
	if responsible != nil {
		if *responsible == uint8(1) {
			c.Type = "Responsable"
		} else {
			c.Type = "No Responsable"
		}
	} else {
		c.Type = "No esta hospedado actualmente"
	}

	if room != nil {
		c.Room = *room
	} else {
		c.Room = "No esta hospedado actualmente"
	}
}

// type that represents a room
type Room struct {
	// unique code of the room
	Code string `json:"code"`
	// capacity of the room
	Capacity uint8 `json:"capacity"`
	// Orientation of the room
	Orientation string `json:"orientation"`
	// occupancy of the room
	Occupancy string `json:"occupancy"`
	// inventory state of the room represented with values from 1 to 10
	InventoryState float32 `json:"inventory_state"`
}

// type that represents a room object with code and state represented with values from 1 to 10
type RoomObject struct {
	// unique code of the room object
	Code uint64 `json:"code"`
	// room that the object is in
	Room string `json:"room"`
	// state of the room object represented with values from 1 to 10
	State uint8 `json:"state"`
	// type of the room object
	Type string `json:"type"`
}

// type that represents a room record with the room, the date and the time of the record
type RoomRecord struct {
	// unique code of the room record
	Code uint8 `json:"code"`
	// room that the record is in
	Room string `json:"room"`
	// Client responsible for the record
	Responsible string `json:"responsible"`
	// record is active or not
	Active bool `json:"active"`
	// start datetime of the record
	StartDateTime string `json:"start"`
	// end datetime of the record
	EndDateTime string `json:"end"`
	// clients that are in the room with the responsible
	Companions []string `json:"companions"`
}

// type that defines a room detail view
type RoomDetail struct {
	// clients that are in the room
	Clients []Client `json:"clients"`
	// objects that are in the room
	Objects []RoomDetailObj `json:"objects"`
}

type RoomDetailObj struct {
	// type of the room object
	Type string `json:"type"`
	// state of the room object
	State float64 `json:"state"`
	// total amount of objects of this type
	Total uint64 `json:"total"`
}

func (r *RoomRecord) SetCompanions(companions *string) {
	if companions != nil {
		r.Companions = strings.Split(*companions, ",")
	} else {
		r.Companions = []string{}
	}
}
