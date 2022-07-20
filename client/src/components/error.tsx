import React from "react";

interface ErrorAlterProps {
  show: boolean
  message: string
}

export const ErrorAlert: React.FC<ErrorAlterProps> = ({show, message}) => {
  return (
    <>
    {show ?
      <div className="my-3 min-w-full rounded-md border border-red text-red p-2">
        <p>{message}</p>
      </div> 
    : null}
    </>
  )
  
}