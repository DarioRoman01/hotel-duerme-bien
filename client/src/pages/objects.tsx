import React, { useEffect, useState } from "react";
import { Navbar } from "../components/navbar";
import { Table } from "../components/table";
import { getRequest, RoomObjectsResponse } from "../requests/requests";

export const Objects: React.FC = () => {
  const [rows, setRows] = useState([] as JSX.Element[])

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

  return (
    <div className="grid grid-cols-12 grid-rows-12 min-w-full">
      <div className="bg-contrast row-span-3 col-span-12 h-16">
        <Navbar />
      </div>
      <div className="flex justify-center min-h-fit sm:min-h-screen col-span-12 row-span-5 sm:col-span-9 sm:row-span-9">
        <Table columns={["codigo", "habitacion", "estado", "tipo"]} rows={rows} />
      </div>
      <div className="bg-contrast col-span-12 row-span-4 sm:col-span-3 sm:row-span-9 min-h-screen p-3">
        
      </div>
    </div>
  )
}