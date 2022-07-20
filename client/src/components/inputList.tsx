import React, { useState } from "react";
import { FloatingLabelInput } from "./floatingLabel";

type companion = { rut: string }

interface InputsListProps {
  onChange: React.Dispatch<React.SetStateAction<string[]>>
}

export const InputsList: React.FC<InputsListProps> = ({onChange}) => {
  const [companions, setCompanions] = useState([{rut: ""}] as companion[])

  const addCompanion = () => {
    setCompanions([...companions, {rut: ""}])
  }

  const removeCompanion = (idx: number) => {
    const list = [...companions];
    list.splice(idx, 1);
    setCompanions(list)
    onChange(list.map(companion => companion.rut))
  }

  const handleCompanionChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const value = e.target.value;
    const list = [...companions]
    list[idx].rut = value;
    setCompanions(list);
    onChange(list.map(companion => companion.rut))
  }

  return (
    <div className="mb-3 min-w-full ">
        {companions.map((companion, idx) => (
        <div key={idx} className="flex">
          <div className="w-[75%] mr-5">
            <div className="mb-3">
              <FloatingLabelInput id={idx.toString()} value={companion.rut} placeholder="Acompañante" type="text" onChange={(e) => handleCompanionChange(e, idx)} />
            </div>
            {companions.length - 1 === idx && (
              <div className="">
                <button onClick={addCompanion} className="text-contrast bg-secondary hover:bg-secondary text-last font-bold py-2 px-4 rounded">
                  Agregar Acompañante
                </button>
              </div>
            )}
          </div>
          {companions.length > 1 && (
            <div className="ml-3 mt-5">
              <button onClick={_ => removeCompanion(idx)} className="text-contrast bg-secondary hover:bg-secondary text-last font-bold py-1 px-4 rounded">
                Eliminar
              </button>
            </div>
          )}
        </div>  
        ))}
 
    </div>
  )
}