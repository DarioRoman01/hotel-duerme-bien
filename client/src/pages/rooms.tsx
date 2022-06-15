import React, {useEffect, useRef, useState} from "react";
import { getAllRooms, Room } from "../requests/requests";
import { Table } from "../components/table";

export const Rooms: React.FC = () => {
  const cols = ["codigo", "capacidad", "orientacion", "ocupada", "estado"]
  let roomsArray: Room[] = [];
  const [rooms, setRooms] = useState(roomsArray)
  let firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      getAllRooms()
      .then(r => setRooms(r))
      .catch(err => {throw new Error(err.message)})
    }
  })

  const setRows = () => {
    return rooms.map(room => (
      <tr key={room.codigo} className="bg-contrast text-secondary rounded-md">
        <td className="p-3 text-center">
          {room.codigo}
        </td>
        <td className="p-3 text-center">
          {room.capacidad}
        </td>
        <td className="p-3 text-center">
          {room.orientacion}
        </td>
        <td className="p-3 text-center">
          <span className="bg-red-400 text-gray-50 rounded-md px-2">{room.ocupada}</span>
        </td>
        <td className="p-3 text-center">
          {room.estado}
        </td>
      </tr>
    ))
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Table columns={cols} rows={setRows()} />
    </div>
  )
}