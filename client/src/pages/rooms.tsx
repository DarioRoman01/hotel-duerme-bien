import React, {useEffect, useRef, useState} from "react";
import { Room, api, RoomsResponse } from "../requests/requests";
import { Table } from "../components/table";
import { Navbar } from "../components/navbar";
import { Icon } from '@iconify/react';
import { MultiRangeSlider } from "../components/slider";

export const Rooms: React.FC = () => {
  let minVal = 1
  let maxVal = 10
  const [rooms, setRooms] = useState([] as Room[])
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
        <td className="p-3 text-center">{room.codigo}</td>
        <td className="p-3 text-center">{room.capacidad}</td>
        <td className="p-3 text-center">{room.orientacion}</td>
        <td className="p-3 text-center">{room.estado}</td>
        <td className="p-3 text-center">{room.estado_i}</td>
        <td className="p-3">
          <button className="my-auto mr-2"><Icon icon='fa-solid:eye'/></button>
          <button className="my-auto mx-2"><Icon icon='bi:trash-fill'/></button>
        </td>
      </tr>
    ))
  }

  return (
    <div className="grid grid-cols-12 grid-rows-12 min-w-full">
      <div className="bg-contrast row-span-3 col-span-12 h-16">
        <Navbar />
      </div>
      <div className="flex justify-center min-h-fit sm:min-h-screen col-span-12 row-span-5 sm:col-span-9 sm:row-span-9">
        <Table columns={["codigo", "capacidad", "orientacion", "estado", "estado inmueble", "acciones"]} rows={setRows()} />
      </div>
      <div className="bg-contrast col-span-12 row-span-4 sm:col-span-3 sm:row-span-9 min-h-screen p-3">
        <div className="flex flex-col justify-center items-center p-5">
          <div className="mb-3 text-center">
            <label className="text-3xl text-secondary text-bold">Filtros</label>
          </div>
          <div className="mb-3 min-w-full">
            <select className="form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-secondary bg-contrast bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:border-blue-600 focus:outline-none" aria-label="Default select example">
                <option disabled selected>Estado</option>
                <option value="1">Ocupada</option>
                <option value="2">Reservada</option>
                <option value="3">Libre</option>
            </select>
          </div>
          <div className="mb-3 min-w-full">
            <select className="form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-secondary bg-contrast bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:border-blue-600 focus:outline-none" aria-label="Default select example">
                <option disabled selected>Orientacion</option>
                <option value="1">Norte</option>
                <option value="2">Sur</option>
                <option value="3">Este</option>
                <option value="4">Oeste</option>
            </select>
          </div>
          <div className="min-w-full text-center mb-8">
            <label className="mt-3 text-xl text-secondary">Estado Inventario</label>
            <MultiRangeSlider
              min={minVal}
              max={maxVal}
              onChange={({ min, max }: { min: number; max: number }) => {
                minVal = min;
                maxVal = max;
              }}
            />
          </div>
          <div className="min-w-full">
            <button className="w-full text-contrast bg-secondary hover:bg-secondary text-last font-bold py-2 px-4 rounded">
              Filtrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}