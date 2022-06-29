import React, { useState } from "react";
import { deleteRequest, Room } from "../requests/requests";
import { ErrorAlert } from "./error";

interface DeleteProps {
  room: Room,
  onDelete: Function,
  onCancel: Function
}

export const DeleteRoomModal: React.FC<DeleteProps> = ({room, onDelete, onCancel}) => {
  const [err, setErr] = useState('')
  const [show, setShow] = useState(false);
  
  const handleDeleteSubmit = () => {
    deleteRequest(`rooms?room=${room.codigo}`)
    .then(_ => onDelete())
    .catch(err => {
      setErr(err.message);
      setShow(true);
    })
  }

  return (
    <>
      <div className="col-span-12 p-5 text-center">
        <p className="text-xl">Esta seguro de que desea eliminar la habitacion {room.codigo}?</p>
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