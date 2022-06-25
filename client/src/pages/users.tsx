import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import { Navbar } from "../components/navbar";
import { Table } from "../components/table";
import { getRequest, UsersResponse } from "../requests/requests";
import { FormWrapper, LayaoutWrapper } from "../components/wrappers";
import { FloatingLabelInput } from "../components/floatingLabel";

export const Users: React.FC = () => {
  const [rows, setRows] = useState([] as JSX.Element[]);

  const [username, setUsername] = useState('');
  const [pwd, setPwd] = useState('');
  const [pwdConfirm, setPwdConfirm] = useState('');

  useEffect(() => {
    getRequest<UsersResponse>('users')
    .then(u => callSetRows(u))
    .catch(err => console.log(err))
  }, [])

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

  return (
    <LayaoutWrapper customTable={<Table columns={["Codigo", "Nombre", "Tipo", "Acciones"]} rows={rows} />}>
      <div className="mb-3 text-center">
        <label className="text-3xl text-secondary text-bold">Agregar Usuario</label>
      </div>
      <FormWrapper children={<FloatingLabelInput type="text" placeholder="Nombre" onChange={setUsername} />} />
      <FormWrapper children={<FloatingLabelInput type="password" placeholder="Contraseña" onChange={setPwd} />} />
      <FormWrapper children={<FloatingLabelInput type="password" placeholder="Confirmacion contraseña" onChange={setPwdConfirm} />} />
      <div className="mb-3 min-w-full">
        <button onClick={_ => console.log('a')} className="w-full text-contrast bg-secondary hover:bg-secondary text-last font-bold py-2 px-4 rounded">
          Agregar
        </button>
      </div>
    </LayaoutWrapper>
  )
}