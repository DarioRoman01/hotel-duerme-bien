import React from "react";
import { RoomObject } from "../requests/requests";
import { ModalWrapper } from "./wrappers";

interface ObjectModalProps {
  object: RoomObject
  visible: boolean
  handleClose: any
  action: string
  onUpdate: Function
}

export const ObjectModal: React.FC<ObjectModalProps> = ({object, visible, handleClose, action, onUpdate}) => {
  return (
    <ModalWrapper title={`Objeto: ${object.codigo}`} handleClose={handleClose} visible={visible}>
      <h1 className="text-xl text-bold">{action === 'update' ? 'updateeee' : 'deleteeee'}</h1>
    </ModalWrapper>
  )
}