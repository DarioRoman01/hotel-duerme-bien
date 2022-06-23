import React from "react";
import { Room } from "../requests/requests";
import { Icon } from '@iconify/react';

interface ModalProps {
  room: Room
  visible: boolean
  handleClose: any
}

export const RoomModal: React.FC<ModalProps> = ({room, visible, handleClose}) => {
  return (
    <div className={"modal fixed top-0 left-0 z-40 w-full h-full " + (visible ? "flex justify-center items-center" : "hidden")}>
      <div className="fixed w-9/12 h-fit z-50 rounded-md bg-contrast text-secondary grid grid-cols-12 grid-rows-12">
        <div className="col-span-12 row-span-1 flex justify-between p-4">
          <div>
            <h1>{room.codigo}</h1>
          </div>
          <div>
            <button onClick={handleClose} className="h-auto text-xl text-secondary font-bold py-2 px-4 rounded">
              <Icon icon="bi:x-circle-fill"/>
            </button>
          </div>
        </div>
        <div className="col-span-12 p-4">
          <div className="rounded-md border border-secondary p-2">
            <p>Camas: 10 estado camas: 6.5</p>
          </div>
        </div>
        <div className="col-span-12 p-4">
          <div className="rounded-md border border-secondary p-2">
            <p>Camas: 10 estado camas: 6.5</p>
          </div>
        </div>
        <div className="col-span-12 p-4">
          <div className="rounded-md border border-secondary p-2">
            <p>Camas: 10 estado camas: 6.5</p>
          </div>
        </div>
        <div className="col-span-12 p-4">
          <div className="rounded-md border border-secondary p-2">
            <p>Camas: 10 estado camas: 6.5</p>
          </div>
        </div>
        <div className="col-span-12 p-4">
          <div className="rounded-md border border-secondary p-2">
            <p>Camas: 10 estado camas: 6.5</p>
          </div>
        </div>
        <div className="col-span-12 p-4">
          <div className="rounded-md border border-secondary p-2">
            <p>Camas: 10 estado camas: 6.5</p>
          </div>
        </div>
      </div>
    </div>
  )
}