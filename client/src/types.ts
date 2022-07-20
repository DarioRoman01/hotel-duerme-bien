export interface Room {
  code: string,
  capacity: number,
  orientation: string,
  occupancy: string,
  inventory_state: number
}

export interface Client {
  rut: string,
  name: string,
  reputation: number,
  type: number
  room: string,
}

export interface RoomObject {
  code: string,
  room: string,
  state: number,
  type: string
}

export interface StaffUser {
  code: number,
  name: string,
  role: string
}

export interface RoomRecord {
  code: number,
  room: string,
  responsible: string,
  active: boolean,
  start: string,
  end: string,
  companions: string[],
}

export interface RoomDetail {
  clients: Client[]
  objects: RoomDetailObj[]
}

interface RoomDetailObj {
  type: string,
  state: number,
  total: number
}

export interface ModalEvents<T> {
  close: null
  update: T
  delete: T
}