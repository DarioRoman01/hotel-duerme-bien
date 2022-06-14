import React, { useState } from "react";
import { FloatingLabelInput } from "../components/floatingLabel";
import { useNavigate } from "react-router-dom";
import { loginUSer } from "../requests/requests";

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [pwd, setPwd] = useState('');
  const [fail, setFail] = useState(false);
  const [failMessage, setFailMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    loginUSer(username, pwd)
    .then(_ => navigate('/home'))
    .catch(err=> {
      setFailMessage(err.message);
      setFail(true);
    })
  }

  return (
    <div className="lg:container lg:mx-auto min-h-screen flex justify-center items-center">
      <div className="grid grid-cols-1 gap-5">
        <div className="text-center">
          <label className="text-2xl text-secondary">Login</label>
        </div>
        <div>
          <FloatingLabelInput onChange={setUsername} placeholder="usuario" type="text" />
        </div>
        <div>
          <FloatingLabelInput onChange={setPwd} placeholder="contraseña" type="password" />
        </div>
        <a onClick={_ => handleSubmit()} className="bg-secondary hover:bg-secondary text-last font-bold py-2 px-4 rounded">
          Button
        </a>
        {fail ? (<p className="text-center text-2xl text-secondary">{failMessage}</p>) : null}
      </div>
    </div>
  )
}