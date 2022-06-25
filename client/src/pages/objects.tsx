import React, { useEffect, useState } from "react";
import { Navbar } from "../components/navbar";
import { Table } from "../components/table";
import { getRequest, postRequest, RoomObjectsResponse } from "../requests/requests";
import { FormWrapper } from "../components/wrappers";
import { FloatingLabelInput } from "../components/floatingLabel";
import { MultiRangeSlider } from "../components/slider";
import { checkValues } from "./utils";

export const Objects: React.FC = () => {
  const [rows, setRows] = useState([] as JSX.Element[]);

  let minVal = 1;
  let maxVal = 10;
  const [room, setRoom] = useState('');
  const [tipo, setTipo] = useState('');

  useEffect(() => {
    getRequest<RoomObjectsResponse>('objects')
    .then(r => callSetRows(r))
    .catch(err => console.log(err))
  }, [])

  const callSetRows = (r: RoomObjectsResponse) => {
    setRows(r.objects.map(obj => (
      <tr key={obj.codigo} className="bg-contrast text-secondary rounded-md">
        <td className="p-3 text-center">{obj.codigo}</td>
        <td className="p-3 text-center">{obj.habitacion}</td>
        <td className="p-3 text-center">{obj.estado}</td>
        <td className="p-3 text-center">{obj.tipo}</td>
      </tr>
    )))
  }

  const handleFilterSubmit = () => {
    const filters = {
      room: checkValues(room),
      type: checkValues(tipo),
      min: minVal == 1 ? null : minVal,
      max: maxVal == 1 ? null : maxVal
    }

    postRequest<RoomObjectsResponse>(filters, 'objects')
    .then(r => callSetRows(r))
    .catch(err => console.log(err))

  }

  return (
    <div className="grid grid-cols-12 grid-rows-12 min-w-full">
      <div className="bg-contrast row-span-3 col-span-12 h-16">
        <Navbar />
      </div>
      <div className="flex justify-center min-h-fit sm:min-h-screen col-span-12 row-span-5 sm:col-span-9 sm:row-span-9">
        <Table columns={["codigo", "habitacion", "estado", "tipo"]} rows={rows} />
      </div>
      <div className="bg-contrast col-span-12 row-span-4 sm:col-span-3 sm:row-span-9 min-h-screen p-3">
        <div className="flex flex-col justify-center items-center p-5">
          <div className="mb-3 text-center">
            <label className="text-3xl text-secondary text-bold">Filtros</label>
          </div>
          {/* <FormWrapper children={}/> */}
          <FormWrapper children={<FloatingLabelInput onChange={setRoom} placeholder="Habitacion" type="text"/>} />
          <FormWrapper children={<FloatingLabelInput onChange={setTipo} placeholder="Tipo Objeto" type="text"/>} />
          <div className="min-w-full text-center mb-8">
            <label className="mt-3 text-xl text-secondary">Estado Inventario</label>
            <MultiRangeSlider min={minVal} max={maxVal} onChange={({ min, max }: { min: number; max: number }) => { 
              minVal = min; 
              maxVal = max;
            }}/>
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