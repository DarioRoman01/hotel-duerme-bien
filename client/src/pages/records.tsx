import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "../components/navbar";
import { Table } from "../components/table";
import { getRequest, Record, RecordsResponse } from "../requests/requests";

export const Records: React.FC = () => {
  const [records, setRecords] = useState([] as Record[])
  let firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      getRequest<RecordsResponse>("/records")
      .then(r => setRecords(r.records))
      .catch(err => console.log(err))
    }
  })

  const setRows = () => {
    return records.map(record => (
      <tr key={record.codigo} className="bg-contrast text-secondary rounded-md">
        <td className="p-3 text-center">{record.codigo}</td>
        <td className="p-3 text-center">{record.codigo_habitacion}</td>
        <td className="p-3 text-center">{record.activa ? "activa" : 'no activa'}</td>
        <td className="p-3 text-center">{record.fecha_asignacion}</td>
        <td className="p-3 text-center">{record.fecha_termino}</td>
        <td className="p-3 text-center">{record.clientes.map(c => <p>{c.nombre}</p>)}</td>
      </tr>
    ))
  }

  return (
    <div className="grid grid-cols-12 min-w-full">
      <div className="bg-contrast col-span-12 h-16">
        <Navbar />
      </div>
      <div className="flex justify-center min-h-screen col-span-9">
        <Table columns={["codigo", "codigo habitacion", "activa", "fehca inicio", "fecha termino", "clientes"]} rows={setRows()} />
      </div>
      <div className="bg-contrast col-span-3">

      </div>
    </div>
  )
}