import React from "react";
import { Room } from "../requests/requests";
import { Icon } from '@iconify/react';
import { RoomDetailModal } from "./roomDetail";
import { RoomUpdateModal } from "./roomUpdateForm";
import { DeleteRoomModal } from "./deleteRoom";
import { ModalWrapper } from "./wrappers";

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
    <ModalWrapper handleClose={handleClose} title={`Habitacion: ${room.codigo}`} visible={visible}>
      {action === 'detail' && (<RoomDetailModal room={room} />)}
      {action === 'update' && (<RoomUpdateModal onUpdate={handleEvent} room={room} />)}
      {action === 'delete' && (<DeleteRoomModal onCancel={handleClose} onDelete={handleEvent}  room={room} />)}
    </ModalWrapper>
  )
}