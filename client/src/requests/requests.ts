// represents a room
export type Room = {
  codigo: string,
  capacidad: number,
  orientacion: string,
  estado: string,
  estado_i: number
}

// represents the response send by server of a list of rooms
export type RoomsResponse = {
  rooms: Room[]
}

// represents a client
export type Client = {
  rut: string,
  nombre: string,
  reputacion: number,
  responsable: number
  habitacion: string,
}

// represents the response send by server of a list of clients
export type CilentResponse = {
  clients: Client[]
}

// represents a room record
export type Record = {
  activa: boolean,
  clientes: Client[],
  codigo: number,
  codigo_habitacion: string,
  fecha_asignacion: string,
  fecha_termino: string
}

// represents the response send by server of a list of rooms records
export type RecordsResponse = {
  records: Record[]
}

// represents a room object in the detail 
type RoomDetailObject = {
  state: string,
  total: number,
  type: string
}

// represents the room detail
export type RoomDetail = {
  clients: Client[]
  objects: RoomDetailObject[] 
}

// represents a room object
export type RoomObject = {
  codigo: number,
  habitacion: string,
  estado: number,
  tipo: string
}

// represents the response send by server of a list of rooms objects
export type RoomObjectsResponse = {
  objects: RoomObject[]
}

// represents a user
export type User = {
  codigo: number,
  type: string,
  username: string
}

// represents the response send by server of a list of users
export type UsersResponse = {
  users: User[]
}

// common headers in the request
const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
}

// url where the api is hosted
const url = 'https://haizza.codes/'

// post request is a generic function to handle post request
export async function postRequest<T>(body: Object, endpoint: string): Promise<T> {
  const res = await fetch(`${url}${endpoint}`, {
    method: "post",
    body: JSON.stringify(body),
    headers: headers,
    credentials: 'include'
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err["error"]);
  }

  return await res.json()
}

// get request is a generic function to make get requests
export async function getRequest<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${url}${endpoint}`, {
    credentials: 'include',
    headers: headers,
  })
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err['error'])
  }
  return await response.json();
}

// genereci function to handle patch requests
export async function patchRequest<T>(body: object, endpoint: string): Promise<T>  {
  const res = await fetch(`${url}${endpoint}`, {
    method: "PATCH",
    body: JSON.stringify(body),
    headers: headers,
    credentials: 'include'
  })

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err['error'])
  }
  return await res.json();

}

// generic function to handle delete requests
export async function deleteRequest<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${url}${endpoint}`, {
    method: "delete",
    credentials: 'include',
    headers: headers,
  })

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err['error'])
  }

  return await res.json();
}