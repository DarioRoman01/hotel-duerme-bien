import classNames from "classnames";
import React, {useEffect} from "react";
import { Room } from "../requests/requests";

interface ModalProps {
  room: Room
  visible: boolean
  handleClose: any
}

export const RoomModal: React.FC<ModalProps> = ({room, visible, handleClose}) => {
  return (
    <div className={"fixed top-0 left-0 w-full h-full  " + (visible ? "block" : "hidden")}>
      <div className="fixed w-4/5 h-fit top-2/4 left-2/4 bg-secondary">
        <h1>{room.codigo}</h1>
        <button onClick={handleClose} className="bg-contrast rounded rounded-md">
          close
        </button>
      </div>
    </div>
  )
}