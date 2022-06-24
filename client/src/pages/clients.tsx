import React, {useState, useEffect, useRef } from "react";
import { getRequest, CilentResponse, postRequest } from "../requests/requests";
import { Table } from "../components/table";
import { Navbar } from "../components/navbar";
import { FloatingLabelInput } from "../components/floatingLabel";
import { checkValues } from "./utils";

export const Clients: React.FC = () => {
  const [rows, setRows] = useState([] as JSX.Element[])
  const [creation, setCreation] = useState(false);

  // filters inputs state
  const [tipo, setTipo] = useState('');
  const [name, setName] = useState('');
  const [room, setRoomId] = useState('');

  // creation inputs states
  const [newName, setNewName] = useState('');
  const [newRut, setNewRut] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  

  useEffect(() => {
    getRequest<CilentResponse>("/clients")
    .then(c => callSetRows(c))
    .catch(err => console.log(err)) 
  }, [creation])

  const handleFilterSubmit = () => {
    const filters = {
      tipo: checkValues(tipo),
      name: checkValues(name),
      room: checkValues(room),
    }

    postRequest<CilentResponse>(filters, 'clients')
    .then(c => callSetRows(c))
    .catch(err => console.log(err))
  }

  const handleCreationSubmit = () => {
    if (!checkValues(newName) || !checkValues(newRut)) {
      setErr('Todos los campos son requeridos')
      setShow(true)
      return
    }

    setShow(false)
    const body = { name: newName, rut: newRut }
    postRequest<any>(body, 'clients/create')
    .then(_ => setCreation(!creation))
    .catch(err => {
      setShow(true)
      setErr(err.message)
    })
  }

  const callSetRows = (c: CilentResponse) => {
    setRows(c.clients.map(client => (
      <tr key={client.rut} className="bg-contrast text-secondary rounded-md">
        <td className="p-3 text-center">{client.rut}</td>
        <td className="p-3 text-center">{client.nombre}</td>
        <td className="p-3 text-center">{client.reputacion}</td>
        <td className="p-3 text-center">{client.responsable}</td>
        <td className="p-3 text-center">{client.habitacion}</td>
      </tr>
    )))
  }

  return (
    <div className="grid grid-cols-12 grid-rows-12 min-w-full">
      <div className="bg-contrast row-span-3 col-span-12 h-16">
        <Navbar />
      </div>
      <div className="flex justify-center min-h-fit sm:min-h-screen col-span-12 row-span-5 sm:col-span-9 sm:row-span-9">
        <Table columns={["rut", "nombre", "reputacion", "tipo", "habitacion"]} rows={rows} />
      </div>
      <div className="bg-contrast col-span-12 row-span-4 sm:col-span-3 sm:row-span-9 min-h-screen p-3">
        <div className="flex flex-col justify-center items-center p-5">
          <div className="mb-3 text-center">
            <label className="text-3xl text-secondary text-bold">Filtros</label>
          </div>
          <div className="mb-3 min-w-full">
            <select value={tipo} onChange={e => setTipo(e.target.value)} className="form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-secondary bg-contrast bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:border-blue-600 focus:outline-none" aria-label="Default select example">
                <option value=''>Tipo Cliente</option>
                <option value="pasajero responsable">Pasajero Responsable</option>
                <option value="acompañante">Acompañante</option>
            </select>
          </div>
          <div className="mb-3 min-w-full">
              <FloatingLabelInput placeholder="Nombre" type='text' onChange={setName} />
          </div>
          <div className="mb-3 min-w-full">
              <FloatingLabelInput placeholder="Habitacion" type='text' onChange={setRoomId} />
          </div>
          <div className="mb-3 min-w-full">
            <button onClick={handleFilterSubmit} className="w-full text-contrast bg-secondary hover:bg-secondary text-last font-bold py-2 px-4 rounded">
              Filtrar
            </button>
          </div>
          <div className="my-3 text-center">
            <label className="text-3xl text-secondary text-bold">Agregar Cliente</label>
          </div>
          <div className="mb-3 min-w-full">
              <FloatingLabelInput placeholder="Nombre" type='text' onChange={setNewName} />
          </div>
          <div className="mb-3 min-w-full">
              <FloatingLabelInput placeholder="Rut" type='text' onChange={setNewRut} />
          </div>
          <div className="mb-3 min-w-full">
            <button onClick={handleCreationSubmit} className="w-full text-contrast bg-secondary hover:bg-secondary text-last font-bold py-2 px-4 rounded">
              Agregar
            </button>
          </div>
          {show ?
            <div className="min-w-full rounded-md border border-red text-red text-center p-2">
              <p>{err}</p>
            </div> : null
          }
        </div>
      </div>
    </div>
  )
}