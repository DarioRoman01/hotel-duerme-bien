import React, { Children, useEffect, useRef, useState } from "react";
import { Room } from "../requests/requests";
import { Icon } from '@iconify/react';
import { RoomDetail, getRequest } from '../requests/requests';
import { Loader } from "./loader";

interface ModalProps {
  room: Room
  visible: boolean
  handleClose: any
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

export const RoomModal: React.FC<ModalProps> = ({room, visible, handleClose}) => {
  const [detail, setDetail] = useState({clients: [], objects: []} as RoomDetail);
  const isInitialMount = useRef(true);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if(isInitialMount.current) {
      isInitialMount.current = false;
    } else {
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
  }, [room])

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
      </div>
    </div>
  )
}