import React, { useEffect, useRef, useState } from "react";
import { deleteRequest, patchRequest, Room } from "../requests/requests";
import { Icon } from '@iconify/react';
import { RoomDetailModal } from "./roomDetail";
import { RoomUpdateModal } from "./roomUpdateForm";
import { DeleteRoomModal } from "./deleteRoom";

interface ModalProps {
  room: Room
  visible: boolean
  handleClose: any
  action: string
  onUpdate: Function
}
export const RoomModal: React.FC<ModalProps> = ({room, visible, handleClose, action, onUpdate}) => {
  const handleEvent = () => {
    onUpdate();
    handleClose();
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
        {action === 'detail' && (<RoomDetailModal room={room} />)}
        {action === 'update' && (<RoomUpdateModal onUpdate={handleEvent} room={room} />)}
        {action === 'delete' && (<DeleteRoomModal onCancel={handleClose} onDelete={handleEvent}  room={room} />)}
      </div>
    </div>
  )
}