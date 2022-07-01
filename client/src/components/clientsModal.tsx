import React, { useEffect, useState } from "react";
import { Client } from "../requests/requests";
import { ErrorAlert } from "./error";
import { FloatingLabelInput } from "./floatingLabel";
import { DeleteFormProps, ModalProps, UpdateFormProps } from "./utils";
import { ModalWrapper } from "./wrappers";

export const ClientsModal: React.FC<ModalProps<Client>> = ({visible, object, handleClose, action, onUpdate}) => {
  return (
    <ModalWrapper title={`Cliente: ${object.nombre}`} handleClose={handleClose} visible={visible}>
      {action === 'update' && (<UpdateClientForm object={object} onUpdate={onUpdate} />)}
      {action === 'delete' && (<DeleteClientForm object={object} onCancel={handleClose} onDelete={onUpdate} />)}
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


  return (<>
    <div className="col-span-12 p-5">
        <FloatingLabelInput onChange={e => setReputation(e.currentTarget.value)} placeholder="Estado" type="Reputacion" value={reputation} />
      </div>
      <div className="col-span-12 p-5">
        <FloatingLabelInput onChange={e => setName(e.currentTarget.value)} placeholder="Tipo Objeto" type="Nombre" value={name} />
      </div>
      <div className="col-span-12 p-5">
        <button  className="w-full text-contrast bg-secondary hover:bg-secondary text-last font-bold py-2 px-4 rounded">
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
    console.log(`delete object ${object.nombre}`)
    onDelete();
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