import React, { useEffect, useState } from "react";
import { Navbar } from "../components/navbar";
import { Table } from "../components/table";
import { getRequest, postRequest, RoomObjectsResponse } from "../requests/requests";
import { FormWrapper, LayaoutWrapper } from "../components/wrappers";
import { FloatingLabelInput } from "../components/floatingLabel";
import { MultiRangeSlider } from "../components/slider";
import { checkValues } from "./utils";
import { ErrorAlert } from "../components/error";

export const Objects: React.FC = () => {
  const [rows, setRows] = useState([] as JSX.Element[]);
  const [err, setErr] = useState('');
  const [show, setShow] = useState(false);
  const [creation, setCreation] = useState(false);

  // filters input state
  let minVal = 1;
  let maxVal = 10;
  const [room, setRoom] = useState('');
  const [tipo, setTipo] = useState('');

  // cretion inputs state
  const [newRoom, setNewRoom] = useState('');
  const [newTipo, setNewTipo] = useState('');
  const [newState, setNewState] = useState('');

  useEffect(() => {
    getRequest<RoomObjectsResponse>('objects')
    .then(r => callSetRows(r))
    .catch(err => console.log(err))
  }, [creation])

  const handleCreationSubmit = () => {
    const validObjectTypes = ['cama', 'espejo', 'velador', 'televisor', 'silla', 'control', 'aire_acondicionado', 'sabanas', 'frasadas', 'toallas', 'almohadas', 'nevera', 'caja_fuerte', 'telefono_servicio']
    if (!checkValues(newRoom) && !checkValues(newTipo) && !checkValues(newState)) {
      setErr('todos los campos son requeridos')
      setShow(true)
      return
    }

    const objType = validObjectTypes.find(obj => obj === newTipo.toLowerCase())
    if (!objType) {
      setErr('El tipo de objeto indicado no es valido')
      setShow(true)
      return
    }

    const state = parseInt(newState)
    if (Number.isNaN(state)) {
      setErr('Debe ingresar numeros en el campo Estado')
      setShow(true)
      return
    }

    if (state > 10 && state < 1) {
      setErr('los numeros ingresador en Estado deben estar en el rango de 1 y 10')
      setShow(true)
      return
    }

    setShow(false)
    const filters = {
      room: newRoom,
      type: newTipo,
      state: newState
    }

    postRequest<any>(filters, 'objects/create')
    .then(_ => setCreation(!creation))
    .catch(err => {
      setErr(err.message)
      setShow(true)
    })

  }

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
    <LayaoutWrapper customTable={<Table columns={["codigo", "habitacion", "estado", "tipo"]} rows={rows} />}>
      <div className="mb-3 text-center">
        <label className="text-3xl text-secondary text-bold">Filtros</label>
      </div>
      <FormWrapper children={<FloatingLabelInput onChange={setRoom} placeholder="Habitacion" type="text"/>} />
      <FormWrapper children={<FloatingLabelInput onChange={setTipo} placeholder="Tipo Objeto" type="text"/>} />
      <div className="min-w-full text-center mb-8">
        <label className="mt-3 text-xl text-secondary">Estado Inventario</label>
        <MultiRangeSlider min={minVal} max={maxVal} onChange={({ min, max }: { min: number; max: number }) => { 
          minVal = min; 
          maxVal = max;
        }}/>
      </div>
      <div className="mb-3 min-w-full">
        <button onClick={handleFilterSubmit} className="w-full text-contrast bg-secondary hover:bg-secondary text-last font-bold py-2 px-4 rounded">
          Filtrar
        </button>
      </div>
      <div className="mb-3 text-center">
        <label className="text-3xl text-secondary text-bold">Agregar objeto</label>
      </div>
      <FormWrapper children={<FloatingLabelInput onChange={setNewRoom} placeholder="Habitacion" type="text"/>} />
      <FormWrapper children={<FloatingLabelInput onChange={setNewTipo} placeholder="Tipo Objeto" type="text"/>} />
      <FormWrapper children={<FloatingLabelInput onChange={setNewState} placeholder="Estado" type="text"/>} />
      <div className="mb-3 min-w-full">
        <button onClick={handleCreationSubmit} className="w-full text-contrast bg-secondary hover:bg-secondary text-last font-bold py-2 px-4 rounded">
          Agregar
        </button>
      </div>
      <ErrorAlert show={show} message={err} />
    </LayaoutWrapper>
  )
}