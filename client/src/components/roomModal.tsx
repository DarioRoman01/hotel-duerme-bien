import React, { useEffect, useRef, useState } from "react";
import { patchRequest, Room } from "../requests/requests";
import { Icon } from '@iconify/react';
import { RoomDetail, getRequest } from '../requests/requests';
import { Loader } from "./loader";
import { FloatingLabelInput } from "./floatingLabel";
import { Select } from "./select";
import { ErrorAlert } from "./error";

interface ModalProps {
  room: Room
  visible: boolean
  handleClose: any
  action: string
  onUpdate: Function
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

const Wrapper: React.FC<{children: React.FC}> = (props) => {
  return (
    <div className="col-span-12 p-4 flex justify-center">
      {<props.children />}
    </div>
  )
}

export const RoomModal: React.FC<ModalProps> = ({room, visible, handleClose, action, onUpdate}) => {
  const [detail, setDetail] = useState({clients: [], objects: []} as RoomDetail);
  const isInitialMount = useRef(true);
  const [isFetching, setIsFetching] = useState(false);
  const [err, setErr] = useState('')
  const [show, setShow] = useState(false);

  const [capacity, setCapacity] = useState('');
  const [orientation, setOrientation] = useState(room.orientacion);

  useEffect(() => {
    if(isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      setCapacity(room.capacidad.toString());
      setOrientation(room.orientacion);
      if (action === 'detail') {
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
      }
    }
  }, [room])

  const handleUpdateSubmit = () => {
    const body = { room: room.codigo, capacity: capacity, orientation: orientation }
    patchRequest<any>(body, 'rooms')
    .then(_ => {
      onUpdate()
      handleClose()
    })
    .catch(err => {
      setErr(err.message);
      setShow(true);
    })
  }

  return (
    <div className={"modal fixed top-0 left-0 z-40 w-full h-full " + (visible ? "flex justify-center items-center" : "hidden")}>
      <div className="fixed overflow-x-hidden overflow-y-auto w-9/12 h-fit z-50 rounded-md bg-contrast text-secondary grid grid-cols-12">
        <div className="col-span-12 row-span-1 flex justify-between p-4">
          <div>
            <h1 className="text-xl">Habitacion {room.codigo}</h1>
          </div>
          <div>
            <button onClick={handleClose} className="h-auto text-xl text-secondary font-bold py-2 px-4 rounded">
              <Icon icon="bi:x-circle-fill"/>
            </button>
          </div>
        </div>
        {action === 'detail' &&(<>
          <div className="col-span-12 p-5">
            <h2 className="text-xl">Objetos Habitacion</h2>
          </div>
          {
            visible ? isFetching ? <Wrapper children={Loader} /> : 
            detail.objects.map(obj => <ModalCard text={`${obj.type}s: ${obj.total} estado: ${obj.state}`} />) : null
          }
          <div className="col-span-12 p-4">
            <h2 className="text-xl">CLientes Hospedados actualmente</h2>
          </div>
          {
            visible ? isFetching ? <Wrapper children={Loader} /> : 
            detail.clients.length > 0 ? detail.clients.map(client => <ModalCard text={`nombre: ${client.nombre} rut: ${client.rut}`} />) : 
            <ModalCard text="No hay clientes hospedados actualmente en esta habitacion" /> : 
            null
          }
        </>)}
        {action === 'update' && (<>
          <div className="col-span-12 p-5">
            <FloatingLabelInput placeholder="capacidad" type="text" value={capacity} onChange={(e) => setCapacity(e.currentTarget.value)} />
          </div>
          <div className="col-span-12 p-5">
            <Select selected={room.orientacion} handleChange={e => setOrientation(e.target.value)} options={[['norte', 'Norte'], ['sur', 'Sur'], ['este', 'Este'], ['oeste', 'Oeste']]} />
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
        </>)}
        {action === 'delete' &&(<>
          <div className="col-span-12">
            <h2>deleteeeeee</h2>
          </div>
        </>)}
      </div>
    </div>
  )
}