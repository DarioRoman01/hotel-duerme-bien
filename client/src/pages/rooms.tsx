import React, {useEffect, useRef, useState} from "react";
import { Room, api, RoomsResponse } from "../requests/requests";
import { Table } from "../components/table";
import { Navbar } from "../components/navbar";

export const Rooms: React.FC = () => {
  const cols = ["codigo", "capacidad", "orientacion", "estado", "estado inmueble"]
  let roomsArray: Room[] = [];
  const [rooms, setRooms] = useState(roomsArray)
  let firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      api<RoomsResponse>('/rooms')
      .then(r => setRooms(r.rooms))
      .catch(err => console.log(err))
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
          {room.estado}
        </td>
        <td className="p-3 text-center">
          {room.estado_i}
        </td>
      </tr>
    ))
  }

  return (
    <div className="grid grid-cols-12 grid-rows-12 min-w-full">
      <div className="bg-secondary row-span-3 col-span-12 h-16">
        <Navbar />
      </div>
      <div className="flex justify-center min-h-fit sm:min-h-screen col-span-12 row-span-5 sm:col-span-9 sm:row-span-9">
        <Table columns={cols} rows={setRows()} />
      </div>
      <div className="bg-secondary col-span-12 row-span-4 sm:col-span-3 sm:row-span-9 min-h-screen p-3">
        <div className="flex justify-center">
          <div className="mb-3 xl:w-96">
            <select className="form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-secondary bg-contrast bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:border-blue-600 focus:outline-none" aria-label="Default select example">
                <option disabled selected>Estado</option>
                <option className="opt" value="1">Ocupada</option>
                <option className="opt" value="2">Reservada</option>
                <option className="opt" value="3">Libre</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}