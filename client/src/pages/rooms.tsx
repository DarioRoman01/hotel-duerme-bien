import React, {useEffect, useRef, useState} from "react";
import { getRequest, RoomsResponse, postRequest, Room } from "../requests/requests";
import { Table } from "../components/table";
import { Navbar } from "../components/navbar";
import { Icon } from '@iconify/react';
import { MultiRangeSlider } from "../components/slider";
import { FloatingLabelInput } from "../components/floatingLabel";
import { RoomModal } from "../components/roomModal";

export const Rooms: React.FC = () => {
  let minVal = 1
  let maxVal = 10
  const [estado, setEstado] = useState('')
  const [orientacion, setOrientacion] = useState('')
  const [capacity, setCapacity] = useState('')
  const [rows, setRows] = useState([] as JSX.Element[])
  let firstRender = useRef(true)
  const [visible, setVisible] = useState(false)
  const [room, setRoom] = useState({} as Room)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      getRequest<RoomsResponse>('/rooms')
      .then(r => callSetRows(r))
      .catch(err => console.log(err))
    }
  })
  
  const handleFilterSubmit = () => {
    const filters = {
      'estado': estado === '' ? null : estado,
      'orientacion': orientacion === '' ? null : orientacion,
      'capacidad': capacity === '' ? null : capacity,
      'min': minVal,
      'max': maxVal,
    }
    
    postRequest<RoomsResponse>(filters, 'rooms')
    .then(r => callSetRows(r))
    .catch(err => console.log(err))
  }


  const showModal = (r: Room) => {
    setRoom(r)
    setVisible(true)
  }

  const callSetRows = (r: RoomsResponse) => {
    setRows(r.rooms.map(room => (
      <tr key={room.codigo} className="bg-contrast text-secondary rounded-md">
        <td className="p-3 text-center">{room.codigo}</td>
        <td className="p-3 text-center">{room.capacidad}</td>
        <td className="p-3 text-center">{room.orientacion}</td>
        <td className="p-3 text-center">{room.estado}</td>
        <td className="p-3 text-center">{room.estado_i}</td>
        <td className="p-3">
          <button onClick={() => showModal(room)} className="my-auto mr-2"><Icon icon='fa-solid:eye'/></button>
          <button className="my-auto mx-2"><Icon icon='bi:trash-fill'/></button>
        </td>
      </tr>
    )))
  }

  return (
    <div className="grid grid-cols-12 grid-rows-12 min-w-full">
      <div className="bg-contrast row-span-3 col-span-12 h-16">
        <Navbar />
      </div>
      <div className="flex justify-center min-h-fit sm:min-h-screen col-span-12 row-span-5 sm:col-span-9 sm:row-span-9">
        <RoomModal handleClose={() => setVisible(false)} room={room} visible={visible} />
        <Table columns={["codigo", "capacidad", "orientacion", "estado", "estado inmueble", "acciones"]} rows={rows} />
      </div>
      <div className="bg-contrast col-span-12 row-span-4 sm:col-span-3 sm:row-span-9 min-h-screen p-3">
        <div className="flex flex-col justify-center items-center p-5">
          <div className="mb-3 text-center">
            <label className="text-3xl text-secondary text-bold">Filtros</label>
          </div>
          <div className="mb-3 min-w-full">
            <select value={estado} onChange={e => setEstado(e.target.value)} className="form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-secondary bg-contrast bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:border-blue-600 focus:outline-none" aria-label="Default select example">
                <option value=''>Estado</option>
                <option value="ocupada">Ocupada</option>
                <option value="reservada">Reservada</option>
                <option value="libre">Libre</option>
            </select>
          </div>
          <div className="mb-3 min-w-full">
            <select value={orientacion} onChange={e => setOrientacion(e.target.value)} className="form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-secondary bg-contrast bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:border-blue-600 focus:outline-none" aria-label="Default select example">
                <option value=''>Orientacion</option>
                <option value="norte">Norte</option>
                <option value="sur">Sur</option>
                <option value="este">Este</option>
                <option value="oeste">Oeste</option>
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
          <div className="mb-3 min-w-full">
              <FloatingLabelInput placeholder="capacidad" type='text' onChange={setCapacity} />
          </div>
          <div className="min-w-full">
            <button onClick={handleFilterSubmit} className="w-full text-contrast bg-secondary hover:bg-secondary text-last font-bold py-2 px-4 rounded">
              Filtrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}