import React, {useState, useEffect } from "react";
import { getRequest, CilentResponse, postRequest, Client } from "../requests/requests";
import { Table } from "../components/table";
import { FloatingLabelInput } from "../components/floatingLabel";
import { checkRut, checkValues } from "./utils";
import { Select } from "../components/select";
import { FormWrapper, LayaoutWrapper } from "../components/wrappers";
import { ErrorAlert } from "../components/error";
import { Icon } from "@iconify/react";
import { ClientsModal } from "../components/clientsModal";

export const Clients: React.FC = () => {
  const [rows, setRows] = useState([] as JSX.Element[]);
  const [creation, setCreation] = useState(false);
  const [visible, setVisible] = useState(false);
  const [action, setAction] = useState('');
  const [client, setClient] = useState({} as Client)

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
    getRequest<CilentResponse>("clients")
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

    if (!checkRut(newRut)) {
      setErr('el rut debe ser ingresado con puntos y guion')
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

  const handleActionClick = (c: Client, action: string) => {
    setAction(action)
    setClient(c)
    setVisible(true)
  }

  const callSetRows = (c: CilentResponse) => {
    setRows(c.clients.map(client => (
      <tr key={client.rut} className="bg-contrast text-secondary rounded-md">
        <td className="p-3 text-center">{client.rut}</td>
        <td className="p-3 text-center">{client.nombre}</td>
        <td className="p-3 text-center">{client.reputacion}</td>
        <td className="p-3 text-center">{client.responsable}</td>
        <td className="p-3 text-center">{client.habitacion}</td>
        <td className="p-3 flex mt-1 justify-center">
          <button onClick={_ => handleActionClick(client, 'update')} className="mx-2"><Icon icon='fa6-solid:pen-clip'/></button>
          <button onClick={_ => handleActionClick(client, 'delete')} className="ml-2"><Icon icon='bi:trash-fill'/></button>
        </td>
      </tr>
    )))
  }

  return (
    <LayaoutWrapper 
      customTable={<Table columns={["rut", "nombre", "reputacion", "tipo", "habitacion", "acciones"]} rows={rows} />}
      modal={<ClientsModal onUpdate={() => setCreation(!creation)} handleClose={() => setVisible(false)} object={client} visible={visible} action={action} />}
    >
      <div className="mb-3 text-center">
        <label className="text-3xl text-secondary font-bold">Filtros</label>
      </div>
      <FormWrapper children={<Select handleChange={e => setTipo(e.target.value)} options={[['', 'Tipo Cliente'], ['pasajero responsable', 'Pasajero responsable'], ['acompañante', 'Acompañante']]}/>} />
      <FormWrapper children={<FloatingLabelInput placeholder="Nombre" type='text' onChange={e => setName(e.currentTarget.value)} />} />
      <FormWrapper children={<FloatingLabelInput placeholder="Habitacion" type='text' onChange={e => setRoomId(e.currentTarget.value)} />} />
      <div className="mb-3 min-w-full">
        <button onClick={handleFilterSubmit} className="w-full text-contrast bg-secondary hover:bg-secondary text-last font-bold py-2 px-4 rounded">
          Filtrar
        </button>
      </div>
      <div className="my-3 text-center">
        <label className="text-3xl text-secondary font-bold">Agregar Cliente</label>
      </div>
      <FormWrapper children={<FloatingLabelInput placeholder="Nombre" type='text' onChange={e => setNewName(e.currentTarget.value)} />} />
      <FormWrapper children={<FloatingLabelInput placeholder="Rut" type='text' onChange={e => setNewRut(e.currentTarget.value)} />} />
      <div className="mb-3 min-w-full">
        <button onClick={handleCreationSubmit} className="w-full text-contrast bg-secondary hover:bg-secondary text-last font-bold py-2 px-4 rounded">
          Agregar
        </button>
      </div>
      <ErrorAlert show={show} message={err} />
    </LayaoutWrapper>
  )
}