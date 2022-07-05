import React, { useState, useEffect } from "react";
import { Table } from "../components/table";
import { getRequest, RecordsResponse, postRequest, Record } from "../requests/requests";
import { DatePicker } from "../components/datePickers";
import { FloatingLabelInput } from "../components/floatingLabel";
import { checkRut, checkValues } from "./utils";
import { Select } from "../components/select";
import { FormWrapper, LayaoutWrapper } from "../components/wrappers";
import { InputsList } from "../components/inputList";
import { ErrorAlert } from "../components/error";
import { Icon } from "@iconify/react";
import { RecordsModal } from "../components/recordsModal";

export const Records: React.FC = () => {
  const [rows, setRows] = useState([] as JSX.Element[]);
  const [creation, setCreation] = useState(false);
  const [err, setErr] = useState('')
  const [show, setShow] = useState(false);
  const [visible, setVisible] = useState(false);
  const [action, setAction] = useState('');
  const [record, setRecord] = useState({} as Record);


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
    getRequest<RecordsResponse>("records")
    .then(r => callSetRows(r))
    .catch(err => console.log(err))
  }, [creation])


  // make the filter request to the server
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

  // validate the data to create a record and send the request to the server
  const handleCreationSubmit = () => {
    setShow(false)
    if (!checkValues(newResponsable) || !checkValues(newRoom) || !checkValues(newFinishDate)) {
      setErr('los campos responsable, fecha termino y habitacion son obligatorios');
      setShow(true)
      return
    }


    if (!checkRut(newResponsable)) {
      setErr('el rut debe ser ingresado con puntos y guion')
      setShow(true)
      return
    }

    let ruts = companions.length === 0 || (companions.length === 1 && companions[0] === '') ? null : companions;
    if (ruts) {
      for (let rut of ruts) {
        if(!checkRut(rut)) {
          setErr('el rut debe ser ingresado con puntos y guion')
          setShow(true)
          return
        }
      }
    }

    const body = {
      responsable: newResponsable,
      room: newRoom,
      start: checkValues(newStartDate),
      finish: newFinishDate,
      companions: ruts
    }

    postRequest<any>(body, 'records/create')
    .then(_ => setCreation(!creation))
    .catch(err => {
      setErr(err.message);
      setShow(true);
    })
  }

  // handle the clikc in the table buttons defining the action and record 
  // the action will allow to know wich modal show
  const handleActionClick = (r: Record, action: string) => {
    setAction(action)
    setRecord(r)
    setVisible(true)
  }


  // set the table body using rows as state
  const callSetRows = (r: RecordsResponse) => {
     setRows(r.records.map(record => (
      <tr key={record.codigo} className="bg-contrast text-secondary rounded-md">
        <td className="p-3 text-center">{record.codigo}</td>
        <td className="p-3 text-center">{record.codigo_habitacion}</td>
        <td className="p-3 text-center">{record.activa ? "activa" : 'no activa'}</td>
        <td className="p-3 text-center">{record.fecha_asignacion}</td>
        <td className="p-3 text-center">{record.fecha_termino}</td>
        <td className="p-3 text-center">{record.clientes.filter(c => c.responsable == 1).map(c => <p key={c.rut}>{c.nombre}</p>)}</td>
        <td className="p-3 text-center">{record.clientes.filter(c => c.responsable == 0).map(c => <p key={c.rut}>{c.nombre}</p>)}</td>
        <td className="p-3 flex mt-1 justify-center">
          <button onClick={_ => handleActionClick(record, 'update')} className="mx-2"><Icon icon='fa6-solid:pen-clip'/></button>
          <button onClick={_ => handleActionClick(record, 'delete')} className="ml-2"><Icon icon='bi:trash-fill'/></button>
        </td>
      </tr>
    )))
  }
  
  return (
    <LayaoutWrapper 
      customTable={<Table columns={["codigo", "codigo habitacion", "activa", "fehca inicio", "fecha termino", "responsable", "acompañantes", "acciones"]} rows={rows} />}
      modal={<RecordsModal action={action} handleClose={() => setVisible(false)} object={record} onUpdate={() => setCreation(!creation)} visible={visible} />}
    >
      <div className="mb-3 text-center">
        <label className="text-3xl text-secondary font-bold">Filtros</label>
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
        <label className="text-3xl text-secondary font-bold">Agregar Registro</label>
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