import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import { Navbar } from "../components/navbar";
import { Table } from "../components/table";
import { getRequest, postRequest, UsersResponse } from "../requests/requests";
import { FormWrapper, LayaoutWrapper } from "../components/wrappers";
import { FloatingLabelInput } from "../components/floatingLabel";
import { ErrorAlert } from "../components/error";

export const Users: React.FC = () => {
  const [rows, setRows] = useState([] as JSX.Element[]);
  const [creation, setCreation] = useState(false);
  const [err, setErr] = useState('')
  const [show, setShow] = useState(false);

  const [username, setUsername] = useState('');
  const [pwd, setPwd] = useState('');
  const [pwdConfirm, setPwdConfirm] = useState('');

  useEffect(() => {
    getRequest<UsersResponse>('users')
    .then(u => callSetRows(u))
    .catch(err => console.log(err))
  }, [creation])

  const callSetRows = (u: UsersResponse) => {
    setRows(u.users.map(user => (
      <tr key={user.codigo} className="bg-contrast text-secondary rounded-md">
        <td className="p-3 text-center">{user.codigo}</td>
        <td className="p-3 text-center">{user.username}</td>
        <td className="p-3 text-center">{user.type}</td>
        <td className="p-3 flex mt-1 justify-center">
          <button className="mx-2"><Icon icon='fa6-solid:pen-clip'/></button>
          <button className="ml-2"><Icon icon='bi:trash-fill'/></button>
        </td>
      </tr>
    )))
  }

  const handleCreationSubmit = () => {
    if(pwd != pwdConfirm) {
      setErr('Las contraseñas no coinciden!')
      setShow(true)
      return
    }

    if (pwd.length <= 6) {
      setErr('la contraseña debe ser almenos de 6 caracteres')
      setShow(true)
      return
    }

    setShow(false);
    const body = { username: username, password: pwd };

    postRequest<any>(body, 'users/create')
    .then(_ => setCreation(!creation))
    .catch(err => {
      setErr(err.message);
      setShow(true)
    });
  }

  return (
    <LayaoutWrapper customTable={<Table columns={["Codigo", "Nombre", "Tipo", "Acciones"]} rows={rows} />}>
      <div className="mb-3 text-center">
        <label className="text-3xl text-secondary text-bold">Agregar Usuario</label>
      </div>
      <FormWrapper children={<FloatingLabelInput type="text" placeholder="Nombre" onChange={setUsername} />} />
      <FormWrapper children={<FloatingLabelInput type="password" placeholder="Contraseña" onChange={setPwd} />} />
      <FormWrapper children={<FloatingLabelInput type="password" placeholder="Confirmacion contraseña" onChange={setPwdConfirm} />} />
      <div className="mb-3 min-w-full">
        <button onClick={handleCreationSubmit} className="w-full text-contrast bg-secondary hover:bg-secondary text-last font-bold py-2 px-4 rounded">
          Agregar
        </button>
      </div>
      <ErrorAlert message={err} show={show} />
    </LayaoutWrapper>
  )
}