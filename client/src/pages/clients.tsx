import React, {useState, useEffect } from "react";
import { getRequest, CilentResponse, postRequest } from "../requests/requests";
import { Table } from "../components/table";
import { Navbar } from "../components/navbar";
import { FloatingLabelInput } from "../components/floatingLabel";
import { checkValues } from "./utils";
import { Select } from "../components/select";
import { FormWrapper } from "../components/wrappers";

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
          <FormWrapper children={<Select handleChange={e => setTipo(e.target.value)} options={[['', 'Tipo Cliente'], ['pasajero responsable', 'Pasajero responsable'], ['acompañante', 'Acompañante']]}/>} />
          <FormWrapper children={<FloatingLabelInput placeholder="Nombre" type='text' onChange={setName} />} />
          <FormWrapper children={<FloatingLabelInput placeholder="Habitacion" type='text' onChange={setRoomId} />} />
          <div className="mb-3 min-w-full">
            <button onClick={handleFilterSubmit} className="w-full text-contrast bg-secondary hover:bg-secondary text-last font-bold py-2 px-4 rounded">
              Filtrar
            </button>
          </div>
          <div className="my-3 text-center">
            <label className="text-3xl text-secondary text-bold">Agregar Cliente</label>
          </div>
          <FormWrapper children={<FloatingLabelInput placeholder="Nombre" type='text' onChange={setNewName} />} />
          <FormWrapper children={<FloatingLabelInput placeholder="Rut" type='text' onChange={setNewRut} />} />
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