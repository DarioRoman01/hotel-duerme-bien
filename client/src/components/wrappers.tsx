import React from "react";
import { Navbar } from "./navbar";

export const FormWrapper: React.FC<{children: React.ReactElement}> = (props) => {
  return (
    <div className="mb-3 min-w-full">
      {props.children}
    </div>
  )
}

interface LayaoutProps {
  customTable: React.ReactElement
  children: any
  modal?: React.ReactElement
}

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
