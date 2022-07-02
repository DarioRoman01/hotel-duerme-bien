import React from "react";

interface DatePickerProps {
  label: string,
  onChange: React.ChangeEventHandler<HTMLInputElement>
  type: string,
  value?: string
}

export const DatePicker: React.FC<DatePickerProps> = (props) => {
  return (
    <div className="flex items-center justify-center">
      <div className="mb-3 min-w-full">
        <label className="mb-3 text-md text-secondary">{props.label}</label>
        <input value={props.value} type={props.type} onChange={props.onChange}
          className="form-control block w-full px-3 py-1.5 text-base font-normal text-secondary bg-contrast bg-clip-padding border border-solid border-gray-300 rounded focus:outline-none"
          />
      </div>
    </div>
  )
}