import React, {useState, useEffect, useRef } from "react";
import { Client, api } from "../requests/requests";
import { Table } from "../components/table";
import { Navbar } from "../components/navbar";

export const Clients: React.FC = () => {
  const cols = ["rut", "nombre", "reputacion", "tipo", "habitacion"];
  const firstRender = useRef(true);
  let clientsArray: Client[] = [];
  const [clients, setClients] = useState(clientsArray);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      api<Client[]>("/clients")
      .then(c => setClients(c))
      .catch(err => console.log(err)) 
    }
  })

  const setRows = () => {
    return clients.map(client => (
      <tr key={client.rut} className="bg-contrast text-secondary rounded-md">
        <td className="p-3 text-center">{client.rut}</td>
        <td className="p-3 text-center">{client.nombre}</td>
        <td className="p-3 text-center">{client.reputacion}</td>
        <td className="p-3 text-center">{client.responsable === 1 ? "pasajero resopnasable" : "acompañante"}</td>
        <td className="p-3 text-center">{client.habitacion === null ? client.habitacion : "no esta hospedado actualmente"}</td>
      </tr>
    ))
  }

  return (
    <div className="grid grid-cols-12 min-w-full">
      <div className="bg-secondary col-span-12 h-16">
        <Navbar />
      </div>
      <div className="flex justify-center min-h-screen col-span-9">
        <Table columns={cols} rows={setRows()} />
      </div>
      <div className="bg-secondary col-span-3">

      </div>
    </div>
  )
}