import React, { useState } from "react";

interface tableProps {
  columns: Array<string>
  rows: JSX.Element[]
  
}

export const Table: React.FC<tableProps> = (props) => {
  const trStyle = {borderRadius: "20px"}
  return (
    <div className="col-span-12">
      <div className="overflow-auto lg:overflow_visible">
        <table className="table text-gray-400 border-separate border-spacing-y-2 space-y-6 text-md ">
          <thead className="bg-contrast text-secondary rounded rounded-md">
            <tr  className="" style={trStyle}>
              {props.columns.map(col => (<th key={col} className="p-3 text-left">{col}</th>))}
            </tr>
          </thead>
          <tbody>
            {props.rows}
          </tbody>
        </table>
      </div>
    </div>
  )
}