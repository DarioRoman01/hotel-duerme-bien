export type Room = {
  codigo: string,
  capacidad: number,
  orientacion: string,
  estado: string,
  estado_i: number
}

export type RoomsResponse = {
  rooms: Room[]
}

export type Client = {
  rut: string,
  nombre: string,
  reputacion: number,
  responsable: number
  habitacion: string,
}

export type CilentResponse = {
  clients: Client[]
}

export type Record = {
  activa: boolean,
  clientes: Client[],
  codigo: number,
  codigo_habitacion: string,
  fecha_asignacion: string,
  fecha_termino: string
}

export type RecordsResponse = {
  records: Record[]
}

type RoomDetailObject = {
  state: string,
  total: number,
  type: string
}

export type RoomDetail = {
  clients: Client[]
  objects: RoomDetailObject[] 
}

export type RoomObject = {
  codigo: number,
  habitacion: string,
  estado: number,
  tipo: string
}

export type RoomObjectsResponse = {
  objects: RoomObject[]
}

export type User = {
  codigo: number,
  type: string,
  username: string
}

export type UsersResponse = {
  users: User[]
}

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
}

// post request is a generic function to handle post request
export async function postRequest<T>(body: Object, endpoint: string): Promise<T> {
  const res = await fetch(`http://localhost:5000/${endpoint}`, {
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
  const response = await fetch(`http://localhost:5000/${endpoint}`, {
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
  const res = await fetch(`http://localhost:5000/${endpoint}`, {
    method: "patch",
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
  const res = await fetch(`http://localhost:5000/${endpoint}`, {
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