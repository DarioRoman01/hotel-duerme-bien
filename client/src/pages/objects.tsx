import React, { useEffect, useState } from "react";
import { Navbar } from "../components/navbar";
import { Table } from "../components/table";
import { getRequest, postRequest, RoomObject, RoomObjectsResponse } from "../requests/requests";
import { FormWrapper, LayaoutWrapper } from "../components/wrappers";
import { FloatingLabelInput } from "../components/floatingLabel";
import { MultiRangeSlider } from "../components/slider";
import { checkValues } from "./utils";
import { ErrorAlert } from "../components/error";
import { Icon } from "@iconify/react";
import { ObjectModal } from "../components/objectModal";

export const Objects: React.FC = () => {
  const [rows, setRows] = useState([] as JSX.Element[]);
  const [err, setErr] = useState('');
  const [show, setShow] = useState(false);
  const [creation, setCreation] = useState(false);
  const [obj, setObj] = useState({} as RoomObject);
  const [action, setAction] = useState("");
  const [visible, setVisible] = useState(false);

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

    if (state > 10 || state < 1) {
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

  const handleActionClick = (obj: RoomObject, action: string) => {
    setAction(action)
    setObj(obj)
    setVisible(true)
  }

  const callSetRows = (r: RoomObjectsResponse) => {
    setRows(r.objects.map(obj => (
      <tr key={obj.codigo} className="bg-contrast text-secondary rounded-md">
        <td className="p-3 text-center">{obj.codigo}</td>
        <td className="p-3 text-center">{obj.habitacion}</td>
        <td className="p-3 text-center">{obj.estado}</td>
        <td className="p-3 text-center">{obj.tipo}</td>
        <td className="p-3 flex mt-1 justify-center">
          <button onClick={() => handleActionClick(obj, 'update')} className="mx-2"><Icon icon='fa6-solid:pen-clip'/></button>
          <button onClick={() => handleActionClick(obj, 'delete')} className="ml-2"><Icon icon='bi:trash-fill'/></button>
        </td>
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
    <LayaoutWrapper 
      modal={<ObjectModal onUpdate={() => setCreation(!creation)} handleClose={() => setVisible(false)} object={obj} visible={visible} action={action}/>} 
      customTable={<Table columns={["codigo", "habitacion", "estado", "tipo", "acciones"]} rows={rows} />}
    >
      <div className="mb-3 text-center">
        <label className="text-3xl text-secondary text-bold">Filtros</label>
      </div>
      <FormWrapper children={<FloatingLabelInput onChange={e => setRoom(e.currentTarget.value)} placeholder="Habitacion" type="text"/>} />
      <FormWrapper children={<FloatingLabelInput onChange={e => setTipo(e.currentTarget.value)} placeholder="Tipo Objeto" type="text"/>} />
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
      <FormWrapper children={<FloatingLabelInput onChange={e => setNewRoom(e.currentTarget.value)} placeholder="Habitacion" type="text"/>} />
      <FormWrapper children={<FloatingLabelInput onChange={e => setNewTipo(e.currentTarget.value)} placeholder="Tipo Objeto" type="text"/>} />
      <FormWrapper children={<FloatingLabelInput onChange={e => setNewState(e.currentTarget.value)} placeholder="Estado" type="text"/>} />
      <div className="mb-3 min-w-full">
        <button onClick={handleCreationSubmit} className="w-full text-contrast bg-secondary hover:bg-secondary text-last font-bold py-2 px-4 rounded">
          Agregar
        </button>
      </div>
      <ErrorAlert show={show} message={err} />
    </LayaoutWrapper>
  )
}