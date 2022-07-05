import { Icon } from "@iconify/react";
import React from "react";
import { Navbar } from "./navbar";

// wrapper to have a uniform format between inputs in forms
export const FormWrapper: React.FC<{children: React.ReactElement}> = (props) => {
  return (
    <div className="mb-3 min-w-full">
      {props.children}
    </div>
  )
}

// wrapper to reduce the lines of code in the modal
export const ModalItemWrapper: React.FC<{children: React.FC}> = (props) => {
  return (
    <div className="col-span-12 p-4 flex justify-center">
      {<props.children />}
    </div>
  )
}

interface LayaoutProps {
  customTable: React.ReactElement
  children: any
  modal?: React.ReactElement
}

// wrap the children components to make a uniform layaout in all the pages
export const LayaoutWrapper: React.FC<LayaoutProps> = ({children, customTable, modal=null}) => {
  return (
    <div className="grid grid-cols-12 grid-rows-12 min-w-full">
      <div className="bg-contrast row-span-3 col-span-12 h-16">
        {modal}
        <Navbar />
      </div>
      <div className="flex justify-center min-h-fit sm:min-h-screen col-span-12 row-span-5 sm:col-span-9 sm:row-span-9">
        {customTable}
      </div>
      <div className="bg-contrast col-span-12 row-span-4 sm:col-span-3 sm:row-span-9 min-h-screen p-3">
        <div className="flex flex-col justify-center items-center p-5">
          {children}
      </div>
    </div>
    </div>
  )
}

interface ModalWrapperProps {
  visible: boolean,
  title: string,
  children: any,
  handleClose: any
}

// wraps the children elements to convert it to a modal
export const ModalWrapper: React.FC<ModalWrapperProps> = ({visible, children, title, handleClose}) => {
  return (
    <div className={"modal fixed top-0 left-0 z-40 w-full h-full " + (visible ? "flex justify-center items-center" : "hidden")}>
      <div className="fixed overflow-x-hidden overflow-y-auto w-9/12 h-fit z-50 rounded-md bg-contrast text-secondary grid grid-cols-12">
        <div className="col-span-12 row-span-1 flex justify-between p-4">
          <div>
            <h1 className="text-xl text-bold">{title}</h1>
          </div>
          <div>
            <button onClick={handleClose} className="h-auto text-xl text-secondary font-bold py-2 px-4 rounded">
              <Icon icon="bi:x-circle-fill"/>
            </button>
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}
