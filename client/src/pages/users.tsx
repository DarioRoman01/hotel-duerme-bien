import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import { Table } from "../components/table";
import { getRequest, postRequest, User, UsersResponse } from "../requests/requests";
import { FormWrapper, LayaoutWrapper } from "../components/wrappers";
import { FloatingLabelInput } from "../components/floatingLabel";
import { ErrorAlert } from "../components/error";
import { UsersModal } from "../components/usersModal";

export const Users: React.FC = () => {
  const [rows, setRows] = useState([] as JSX.Element[]);
  const [creation, setCreation] = useState(false);
  const [err, setErr] = useState('')
  const [show, setShow] = useState(false);
  const [visible, setVisible] = useState(false);
  const [user, setUser] = useState({} as User)

  const [username, setUsername] = useState('');
  const [pwd, setPwd] = useState('');
  const [pwdConfirm, setPwdConfirm] = useState('');

  useEffect(() => {
    getRequest<UsersResponse>('users')
    .then(u => callSetRows(u))
    .catch(err => console.log(err))
  }, [creation])

  const handleActionClick = (user: User) => {
    setUser(user)
    setVisible(true)
  }

  const callSetRows = (u: UsersResponse) => {
    setRows(u.users.map(user => (
      <tr key={user.codigo} className="bg-contrast text-secondary rounded-md">
        <td className="p-3 text-center">{user.codigo}</td>
        <td className="p-3 text-center">{user.username}</td>
        <td className="p-3 text-center">{user.type}</td>
        <td className="p-3 flex mt-1 justify-center">
          <button onClick={_ => handleActionClick(user)} className="ml-2"><Icon icon='bi:trash-fill'/></button>
        </td>
      </tr>
    )))
  }

  // validate data to create a user and send the request to the server
  const handleCreationSubmit = () => {
    if(pwd !== pwdConfirm) {
      setErr('Las contraseñas no coinciden!')
      setShow(true)
      return
    }

    if (pwd.length <= 6) {
      setErr('la contraseña debe ser almenos de 7 caracteres')
      setShow(true)
      return
    }

    setShow(false);
    const body = { username: username, password: pwd };

    postRequest<any>(body, 'users')
    .then(_ => setCreation(!creation))
    .catch(err => {
      setErr(err.message);
      setShow(true)
    });
  }

  return (
    <LayaoutWrapper customTable={<Table columns={["Codigo", "Nombre", "Tipo", "Acciones"]} rows={rows} />}
      modal={<UsersModal action="" handleClose={() => setVisible(false)} object={user} visible={visible} onUpdate={() => setCreation(!creation)} />}
    >
      <div className="mb-3 text-center">
        <label className="text-3xl text-secondary text-bold">Agregar Usuario</label>
      </div>
      <FormWrapper children={<FloatingLabelInput id="name" type="text" placeholder="Nombre" onChange={e => setUsername(e.currentTarget.value)} />} />
      <FormWrapper children={<FloatingLabelInput id="pwd" type="password" placeholder="Contraseña" onChange={e => setPwd(e.currentTarget.value)} />} />
      <FormWrapper children={<FloatingLabelInput id="pwdconfirmation" type="password" placeholder="Confirmacion contraseña" onChange={e => setPwdConfirm(e.currentTarget.value)} />} />
      <div className="mb-3 min-w-full">
        <button onClick={handleCreationSubmit} className="w-full text-contrast bg-secondary hover:bg-secondary text-last font-bold py-2 px-4 rounded">
          Agregar
        </button>
      </div>
      <ErrorAlert message={err} show={show} />
    </LayaoutWrapper>
  )
}