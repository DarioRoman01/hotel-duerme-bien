import React, { useState, useEffect } from "react";
import { Table } from "../components/table";
import { getRequest, RecordsResponse, postRequest } from "../requests/requests";
import { DatePicker } from "../components/datePickers";
import { FloatingLabelInput } from "../components/floatingLabel";
import { checkValues } from "./utils";
import { Select } from "../components/select";
import { FormWrapper, LayaoutWrapper } from "../components/wrappers";
import { InputsList } from "../components/inputList";
import { ErrorAlert } from "../components/error";

export const Records: React.FC = () => {
  const [rows, setRows] = useState([] as JSX.Element[]);
  const [creation, setCreation] = useState(false);
  const [err, setErr] = useState('')
  const [show, setShow] = useState(false);


  // filters inputs state
  const [startDate, setStartDate] = useState('');
  const [finishDate, setFinishDate] = useState('');
  const [room, setRoom] = useState('');
  const [state, setState] = useState('');

  // creation inputs state
  const [newStartDate, setNewStartDate] = useState('');
  const [newFinishDate, setNewFinishDate] = useState('');
  const [newRoom, setNewRoom] = useState('');
  const [newResponsable, setNewResponsable] = useState('');
  const [companions, setCompanions] = useState([] as string[])

  useEffect(() => {
    getRequest<RecordsResponse>("/records")
    .then(r => callSetRows(r))
    .catch(err => console.log(err))
  }, [creation])

  const handleSubmit = () => {
    const filters = {
      start: checkValues(startDate),
      finish: checkValues(finishDate),
      room: checkValues(room),
      state: checkValues(state),
    }

    postRequest<RecordsResponse>(filters, 'records')
    .then(r => callSetRows(r))
    .catch(err => console.log(err))
  }

  const handleCreationSubmit = () => {
    if (!checkValues(newResponsable) || !checkValues(newRoom) || !checkValues(newFinishDate)) {
      setErr('los campos responsable, fecha termino y habitacion son obligatorios');
      setShow(true)
      return
    }

    setShow(false)
    const body = {
      responsable: newResponsable,
      room: newRoom,
      start: checkValues(newStartDate),
      finish: newFinishDate,
      companions: companions.length === 0 || (companions.length === 1 && companions[0] === '') ? null : companions
    }

    postRequest<any>(body, 'records/create')
    .then(_ => setCreation(!creation))
    .catch(err => {
      setErr(err.message);
      setShow(true);
    })
  }

  const callSetRows = (r: RecordsResponse) => {
     setRows(r.records.map(record => (
      <tr key={record.codigo} className="bg-contrast text-secondary rounded-md">
        <td className="p-3 text-center">{record.codigo}</td>
        <td className="p-3 text-center">{record.codigo_habitacion}</td>
        <td className="p-3 text-center">{record.activa ? "activa" : 'no activa'}</td>
        <td className="p-3 text-center">{record.fecha_asignacion}</td>
        <td className="p-3 text-center">{record.fecha_termino}</td>
        <td className="p-3 text-center">{record.clientes.map(c => <p>{c.nombre}</p>)}</td>
      </tr>
    )))
  }
  
  return (
    <LayaoutWrapper customTable={<Table columns={["codigo", "codigo habitacion", "activa", "fehca inicio", "fecha termino", "clientes"]} rows={rows} />}>
      <div className="mb-3 text-center">
        <label className="text-3xl text-secondary text-bold">Filtros</label>
      </div>

      <FormWrapper children={<Select handleChange={e => setState(e.target.value)} options={[['', 'Estado'], ['1', 'Activa'], ['0', 'No activa']]} />} />
      <FormWrapper children={<DatePicker type="date" onChange={e => setStartDate(e.target.value)} label="Fecha inicio" />} />
      <FormWrapper children={<DatePicker type="date" onChange={e => setFinishDate(e.target.value)} label="Fecha termino" />} />
      <FormWrapper children={<FloatingLabelInput onChange={e => setRoom(e.currentTarget.value)} placeholder="Habitacion" type="text"/>} />
      
      <div className="min-w-full">
        <button onClick={handleSubmit} className="w-full text-contrast bg-secondary hover:bg-secondary text-last font-bold py-2 px-4 rounded">
          Filtrar
        </button>
      </div>
      <div className="my-3 text-center">
        <label className="text-3xl text-secondary text-bold">Agregar Registro</label>
      </div>
      <FormWrapper children={<FloatingLabelInput onChange={e => setNewRoom(e.currentTarget.value)} placeholder="Habitacion" type="text"/>} />
      <FormWrapper children={<FloatingLabelInput onChange={e => setNewResponsable(e.currentTarget.value)} placeholder="Responsable" type="text"/>} />
      <FormWrapper children={<DatePicker type="datetime-local" onChange={e => setNewStartDate(e.target.value.replace('T', ' '))} label="Fecha inicio" />} />
      <FormWrapper children={<DatePicker type="datetime-local" onChange={e => setNewFinishDate(e.target.value.replace('T', ' '))} label="Fecha termino" />} />
      <InputsList onChange={setCompanions}/>
      <div className="min-w-full">
        <button onClick={handleCreationSubmit} className="w-full text-contrast bg-secondary hover:bg-secondary text-last font-bold py-2 px-4 rounded">
          Agregar
        </button>
      </div>
      <ErrorAlert message={err} show={show} />
    </LayaoutWrapper>
  )
}