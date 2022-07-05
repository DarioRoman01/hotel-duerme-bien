import React, { useState } from 'react';
import { deleteRequest, User } from '../requests/requests';
import { ErrorAlert } from './error';
import { ModalProps } from './utils';
import { ModalWrapper } from './wrappers';

// component to handle the users modal wich only has the delete option
export const UsersModal: React.FC<ModalProps<User>> = ({handleClose, object, onUpdate, visible}) => {
  const [err, setErr] = useState('');
  const [show, setShow] = useState(false);
  
  const handleSubmit = () => {
    setShow(false);
    deleteRequest<any>(`users?user=${object.codigo}`)
    .then(_ => {
      onUpdate()
      handleClose()
    })
    .catch(err => {
      setErr(err.message)
      setShow(true)
    });
  }

  return (
    <ModalWrapper title={`Usuario: ${object.username}`} visible={visible} handleClose={handleClose}>
      <div className="col-span-12">
        <p className="text-xl text-center">Esta seguro de que desea eliminar el usuario {object.username}?</p>
      </div>
      <div className="col-span-12 p-5">
        <div className="flex justify-between">
          <div className="w-full flex justify-center">
            <button onClick={_ => handleClose()} className="w-[45%] text-contrast bg-secondary hover:bg-secondary text-last font-bold py-2 px-4 rounded">
              Cancelar
            </button>
          </div>
          <div className="w-full flex justify-center">
            <button onClick={handleSubmit}  className="w-[45%] text-contrast bg-red text-last font-bold py-2 px-4 rounded">
              Confirmar
            </button>
          </div>
        </div>
      </div>
      <div className="col-span-12 p-5">
        <ErrorAlert message={err} show={show} />
      </div>
    </ModalWrapper>
  )
}