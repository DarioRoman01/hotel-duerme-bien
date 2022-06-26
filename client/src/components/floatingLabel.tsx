import React from "react";

interface inputProps {
  onChange: React.ChangeEventHandler<HTMLInputElement>,
  placeholder: string,
  type: String,
  value?: string
}

export const FloatingLabelInput: React.FC<inputProps> = (props) => {
  return (
    <div className="relative">
      <input value={props.value} onChange={props.onChange} type={`${props.type}`} id="floating_filled" className="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-secondary bg-contrast dark:bg-contrast border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
      <label htmlFor="floating_filled" className="absolute text-sm text-secondary dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4">{props.placeholder}</label>
    </div>
  )
}