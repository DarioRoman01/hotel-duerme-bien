import React, { useEffect, useState } from "react";
import { getRequest, Room, RoomDetail } from "../requests/requests";
import { Loader } from "./loader";
import { ModalItemWrapper } from "./wrappers";

const ModalCard: React.FC<{text: string}> = ({text}) => {
  return (
    <div className="col-span-12 p-4">
      <div className="rounded-md border border-secondary p-2">
        <p>{text}</p>
      </div>
    </div>
  )
}

export const RoomDetailModal: React.FC<{room: Room}> = ({room}) => {
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
      detail.objects.map(obj => <ModalCard text={`${obj.type}s: ${obj.total} estado: ${obj.state}`} />)
    }
    <div className="col-span-12 p-4">
      <h2 className="text-xl">CLientes Hospedados actualmente</h2>
    </div>
    {
      isFetching ? <ModalItemWrapper children={Loader} /> : 
      detail.clients.length > 0 ? detail.clients.map(client => <ModalCard text={`nombre: ${client.nombre} rut: ${client.rut}`} />) : 
      <ModalCard text="No hay clientes hospedados actualmente en esta habitacion" />
    }
  </>)
}