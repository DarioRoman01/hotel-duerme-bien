import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "../components/navbar";
import { Table } from "../components/table";
import { getRequest, RecordsResponse, postRequest } from "../requests/requests";
import { DatePicker } from "../components/datePickers";
import { FloatingLabelInput } from "../components/floatingLabel";
import { checkValues } from "./utils";
import { Select } from "../components/select";
import { FormWrapper, LayaoutWrapper } from "../components/wrappers";

export const Records: React.FC = () => {
  const [startDate, setStartDate] = useState('');
  const [finishDate, setFinishDate] = useState('');
  const [room, setRoom] = useState('');
  const [state, setState] = useState('');
  const [rows, setRows] = useState([] as JSX.Element[]);

  useEffect(() => {
    getRequest<RecordsResponse>("/records")
    .then(r => callSetRows(r))
    .catch(err => console.log(err))
  }, [])

  const handleSubmit = () => {
    // we dont have any filter to apply
    if (!checkValues(startDate) && !checkValues(finishDate) && !checkValues(room) && !checkValues(state)) return
    
    // we have filters to apply
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
      <FormWrapper children={<DatePicker onChange={setStartDate} label="Fecha inicio" />} />
      <FormWrapper children={<DatePicker onChange={setFinishDate} label="Fecha termino" />} />
      <FormWrapper children={<FloatingLabelInput onChange={setRoom} placeholder="Habitacion" type="text"/>} />
      
      <div className="min-w-full">
        <button onClick={handleSubmit} className="w-full text-contrast bg-secondary hover:bg-secondary text-last font-bold py-2 px-4 rounded">
          Filtrar
        </button>
      </div>
    </LayaoutWrapper>
  )
}