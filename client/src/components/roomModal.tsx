import React, { useEffect, useState } from "react";
import { deleteRequest, getRequest, patchRequest, Room, RoomDetail } from "../requests/requests";
import { ModalItemWrapper, ModalWrapper } from "./wrappers";
import { ErrorAlert } from "./error";
import { FloatingLabelInput } from "./floatingLabel";
import { Select } from "./select";
import { Loader } from "./loader";
import { DeleteFormProps, ModalProps, UpdateFormProps } from "./utils";

export const RoomModal: React.FC<ModalProps<Room>> = ({object, visible, handleClose, action, onUpdate}) => {
  const handleEvent = () => {
    onUpdate();
    handleClose();
  }

  return (
    <ModalWrapper handleClose={handleClose} title={`Habitacion: ${object.codigo}`} visible={visible}>
      {action === 'detail' && (<RoomDetailModal room={object} />)}
      {action === 'update' && (<RoomUpdateModal onUpdate={handleEvent} object={object} />)}
      {action === 'delete' && (<DeleteRoomModal onCancel={handleClose} onDelete={handleEvent}  object={object} />)}
    </ModalWrapper>
  )
}

const RoomUpdateModal: React.FC<UpdateFormProps<Room>> = ({object, onUpdate}) => {
  const [err, setErr] = useState('')
  const [show, setShow] = useState(false);
  const [capacity, setCapacity] = useState('');
  const [orientation, setOrientation] = useState(object.orientacion);
  const [state, setState] = useState(object.estado);

  useEffect(() => {
    setCapacity(object.capacidad.toString());
    setOrientation(object.orientacion);
    setState(object.estado);
  }, [object])

  const handleUpdateSubmit = () => {
    setShow(false)

    if (Number.isNaN(parseInt(capacity))) {
      setErr('La capacidad debe ser un numero')
      setShow(true)
    }

    const body = { room: object.codigo, capacity: capacity, orientation: orientation, state: state }
    patchRequest<any>(body, 'rooms')
    .then(_ => onUpdate())
    .catch(err => {
      setErr(err.message);
      setShow(true);
    })
  }

  return (<>
    <div className="col-span-12 p-5">
      <FloatingLabelInput id="updateCapacity" placeholder="capacidad" type="text" value={capacity} onChange={(e) => setCapacity(e.currentTarget.value)} />
    </div>
    <div className="col-span-12 p-5">
      <Select selected={orientation} handleChange={e => setOrientation(e.target.value)} options={[['norte', 'Norte'], ['sur', 'Sur'], ['este', 'Este'], ['oeste', 'Oeste']]} />
    </div>
    <div className="col-span-12 p-5">
      <Select selected={object.estado} handleChange={e => setState(e.target.value)} options={[["libre", "Libre"], ["ocupada", "Ocupada"], ["reservada", "Reservada"]]} />
    </div>
    <div className="col-span-12 p-5">
      <div className="">
        <button onClick={handleUpdateSubmit} className="w-full text-contrast bg-secondary hover:bg-secondary text-last font-bold py-2 px-4 rounded">
          Actualizar
        </button>
      </div>
    </div>
    <div className="col-span-12 p-5">
      <ErrorAlert message={err} show={show} />
    </div>
  </>)
}

const DeleteRoomModal: React.FC<DeleteFormProps<Room>> = ({object, onDelete, onCancel}) => {
  const [err, setErr] = useState('')
  const [show, setShow] = useState(false);
  
  const handleDeleteSubmit = () => {
    deleteRequest(`rooms?room=${object.codigo}`)
    .then(_ => onDelete())
    .catch(err => {
      setErr(err.message);
      setShow(true);
    })
  }

  return (
    <>
      <div className="col-span-12 p-5 text-center">
        <p className="text-xl">Esta seguro de que desea eliminar la habitacion {object.codigo}?</p>
      </div>
      <div className="col-span-12 p-5">
        <div className="flex justify-between">
          <div className="w-full flex justify-center">
            <button onClick={_ => onCancel()}  className="w-[45%] text-contrast bg-secondary hover:bg-secondary text-last font-bold py-2 px-4 rounded">
              Cancelar
            </button>
          </div>
          <div className="w-full flex justify-center">
            <button onClick={handleDeleteSubmit}  className="w-[45%] text-contrast bg-red text-last font-bold py-2 px-4 rounded">
              Confirmar
            </button>
          </div>
        </div>
      </div>
      <div className="col-span-12 p-5">
        <ErrorAlert message={err} show={show} />
      </div>
    </>
  )
}

const ModalCard: React.FC<{text: string}> = ({text}) => {
  return (
    <div className="col-span-12 p-4">
      <div className="rounded-md border border-secondary p-2">
        <p>{text}</p>
      </div>
    </div>
  )
}

const RoomDetailModal: React.FC<{room: Room}> = ({room}) => {
  const [detail, setDetail] = useState({clients: [], objects: []} as RoomDetail);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    setIsFetching(true);
    getRequest<RoomDetail>(`detail?room=${room.codigo}`)
    .then(d => {
      setDetail(d)
      setIsFetching(false);
    })
    .catch(err => {
      console.log(err)
      setIsFetching(false)
    })
  }, [room])

  return (<>
    <div className="col-span-12 p-5">
      <h2 className="text-xl">Objetos Habitacion</h2>
    </div>
    {
      isFetching ? <ModalItemWrapper children={Loader} /> : 
      detail.objects.map((obj, idx) => <ModalCard key={idx} text={`${obj.type}s: ${obj.total} estado: ${obj.state}`} />)
    }
    <div className="col-span-12 p-4">
      <h2 className="text-xl">CLientes Hospedados actualmente</h2>
    </div>
    {
      isFetching ? <ModalItemWrapper children={Loader} /> : 
      detail.clients.length > 0 ? detail.clients.map(client => <ModalCard key={client.rut} text={`nombre: ${client.nombre} rut: ${client.rut}`} />) : 
      <ModalCard text="No hay clientes hospedados actualmente en esta habitacion" />
    }
  </>)
}