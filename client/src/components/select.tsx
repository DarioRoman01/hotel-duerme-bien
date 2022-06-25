import React from "react";
import { SelectOption } from '../pages/utils'

interface SelectProps {
  options: Array<Array<string>>
  handleChange: React.ChangeEventHandler<HTMLSelectElement>
}

export const Select: React.FC<SelectProps> = ({options, handleChange}) => {
  return (
    <div className="mb-3 min-w-full">
      <select onChange={handleChange} className="form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-secondary bg-contrast bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:border-blue-600 focus:outline-none" aria-label="Default select example">
          {options.map(option => (
            <option value={option[0]}>{option[1]}</option>
          ))}
      </select>
    </div>
)
}