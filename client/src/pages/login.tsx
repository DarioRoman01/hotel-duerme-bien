import React, { useState } from "react";
import { FloatingLabelInput } from "../components/floatingLabel";
import { useNavigate } from "react-router-dom";
import { postRequest, User } from "../requests/requests";
import { ErrorAlert } from "../components/error";

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [pwd, setPwd] = useState('');
  const [fail, setFail] = useState(false);
  const [failMessage, setFailMessage] = useState('');
  const navigate = useNavigate();


  // send the login request to the server
  const handleSubmit = () => {
    postRequest<User>({username: username, password: pwd}, 'login')
    .then(user => {
      localStorage.setItem('currentUserType', user.type)
      navigate('/home')
    })
    .catch(err=> {
      setFailMessage(err.message);
      setFail(true);
    })
  }

  return (
    <div className="lg:container lg:mx-auto min-h-screen flex justify-center items-center">
      <div className="grid grid-cols-1 w-fit sm:w-2/6 gap-5">
        <div className="text-center">
          <label className="text-2xl text-secondary font-bold">Login</label>
        </div>
        <div>
          <FloatingLabelInput onChange={e => setUsername(e.currentTarget.value)} placeholder="usuario" type="text" />
        </div>
        <div>
          <FloatingLabelInput onChange={e => setPwd(e.currentTarget.value)} placeholder="contraseña" type="password" />
        </div>
        <button onClick={_ => handleSubmit()} className="bg-secondary hover:bg-secondary text-last font-bold py-2 px-4 rounded">
          Ingresar
        </button>
        <ErrorAlert show={fail} message={failMessage} />
      </div>
    </div>
  )
}