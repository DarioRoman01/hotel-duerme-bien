import React from "react";

interface SelectProps {
  options: Array<Array<string>>
  handleChange: React.ChangeEventHandler<HTMLSelectElement>
  selected?: string
}

export const Select: React.FC<SelectProps> = ({options, handleChange, selected}) => {
  return (
    <div className="mb-3 min-w-full">
      <select onChange={handleChange} className="form-select font-bold appearance-none block w-full px-3 py-1.5 text-base text-secondary bg-contrast bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:border-blue-600 focus:outline-none" aria-label="Default select example">
          {options.map(option => (
            <option className="font-bold" selected={selected && selected === option[0] ? true : false} value={option[0]}>{option[1]}</option>
          ))}
      </select>
    </div>
)
}