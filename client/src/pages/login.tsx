import React, { useState } from "react";
import { FloatingLabelInput } from "../components/floatingLabel";

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [pwd, setPwd] = useState('');


  return (
    <div className="container mx-auto  mt-6 flex justify-center items-center">
      <div className="grid grid-cols-1 gap-4">
        <div className="text-center">
          <label className="text-lg ">Login</label>
        </div>
        <div>
          <FloatingLabelInput onChange={setUsername} placeholder="usuario" type="text" />
        </div>
        <div>
          <FloatingLabelInput onChange={setPwd} placeholder="contraseña" type="password" />
        </div>
        <a onClick={_ => console.log(username, pwd)} href="/home"className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Button
        </a>
      </div>
    </div>
  )
}