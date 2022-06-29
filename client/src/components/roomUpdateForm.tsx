import React, { useEffect, useState } from "react";
import { patchRequest, Room } from "../requests/requests";
import { ErrorAlert } from "./error";
import { FloatingLabelInput } from "./floatingLabel";
import { Select } from "./select";

interface UpdateRoomProps {
  room: Room,
  onUpdate: Function
}

export const RoomUpdateModal: React.FC<UpdateRoomProps> = ({room, onUpdate}) => {
  const [err, setErr] = useState('')
  const [show, setShow] = useState(false);
  const [capacity, setCapacity] = useState('');
  const [orientation, setOrientation] = useState(room.orientacion);

  useEffect(() => {
    setCapacity(room.capacidad.toString());
    setOrientation(room.orientacion);
  }, [room])

  const handleUpdateSubmit = () => {
    const body = { room: room.codigo, capacity: capacity, orientation: orientation }
    patchRequest<any>(body, 'rooms')
    .then(_ => onUpdate())
    .catch(err => {
      setErr(err.message);
      setShow(true);
    })
  }

  return (<>
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
  </>)
}