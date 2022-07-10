import React, { useEffect, useState } from "react";
import { Client, deleteRequest, patchRequest } from "../requests/requests";
import { ErrorAlert } from "./error";
import { FloatingLabelInput } from "./floatingLabel";
import { DeleteFormProps, ModalProps, UpdateFormProps } from "./utils";
import { ModalWrapper } from "./wrappers";

export const ClientsModal: React.FC<ModalProps<Client>> = ({visible, object, handleClose, action, onUpdate}) => {
  const handleEvent = () => {
    onUpdate();
    handleClose();
  }

  return (
    <ModalWrapper title={`Cliente: ${object.nombre}`} handleClose={handleClose} visible={visible}>
      {action === 'update' && (<UpdateClientForm object={object} onUpdate={handleEvent} />)}
      {action === 'delete' && (<DeleteClientForm object={object} onCancel={handleClose} onDelete={handleEvent} />)}
    </ModalWrapper>
  )
}

const UpdateClientForm: React.FC<UpdateFormProps<Client>> = ({object, onUpdate}) => {
  const [reputation, setReputation] = useState('');
  const [name, setName] = useState('')
  const [err, setErr] = useState('')
  const [show, setShow] = useState(false);

  useEffect(() => {
    setReputation(object.reputacion.toString());
    setName(object.nombre);
  }, [object])

  const handleSubmit = () => {
    const body = {
      rut: object.rut,
      name: name,
      reputation: reputation
    }

    patchRequest<any>(body, 'clients')
    .then(_ => onUpdate())
    .catch(err => {
      setErr(err.message)
      setShow(true)
    })
  }

  return (<>
    <div className="col-span-12 p-5">
        <FloatingLabelInput id="updateReputation" onChange={e => setReputation(e.currentTarget.value)} placeholder="Reputacion" type="text" value={reputation} />
      </div>
      <div className="col-span-12 p-5">
        <FloatingLabelInput id="updateName" onChange={e => setName(e.currentTarget.value)} placeholder="Nombre" type="text" value={name} />
      </div>
      <div className="col-span-12 p-5">
        <button onClick={handleSubmit} className="w-full text-contrast bg-secondary hover:bg-secondary text-last font-bold py-2 px-4 rounded">
          Actualizar
        </button>
      </div>
      <div className="col-span-12 p-5">
        <ErrorAlert message={err} show={show} />
      </div>
  </>)
}

const DeleteClientForm: React.FC<DeleteFormProps<Client>> = ({object, onCancel, onDelete}) => {
  const [err, setErr] = useState('');
  const [show, setShow] = useState(false);


  const handleSubmit = () => {
    setShow(false);
    deleteRequest<any>(`clients?rut=${object.rut}`)
    .then(_ => onDelete())
    .catch(err => {
      setErr(err.message)
      setShow(true)
    })
  }

  return (
    <>
      <div className="col-span-12">
        <p className="text-xl text-center">Esta seguro de que desea eliminar al usuario {object.nombre}?</p>
      </div>
      <div className="col-span-12 p-5">
        <div className="flex justify-between">
          <div className="w-full flex justify-center">
            <button onClick={_ => onCancel()} className="w-[45%] text-contrast bg-secondary hover:bg-secondary text-last font-bold py-2 px-4 rounded">
              Cancelar
            </button>
          </div>
          <div className="w-full flex justify-center">
            <button onClick={handleSubmit} className="w-[45%] text-contrast bg-red text-last font-bold py-2 px-4 rounded">
              Confirmar
            </button>
          </div>
        </div>
      </div>
      <div className="col-span-12 p-5">
        <ErrorAlert message={err} show={show} />
      </div>
    </>
  )
}