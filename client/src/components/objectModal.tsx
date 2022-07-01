import React, { useEffect, useState } from "react";
import { RoomObject } from "../requests/requests";
import { ErrorAlert } from "./error";
import { FloatingLabelInput } from "./floatingLabel";
import { DeleteFormProps, ModalProps, UpdateFormProps } from "./utils";
import { ModalWrapper } from "./wrappers";

export const ObjectModal: React.FC<ModalProps<RoomObject>> = ({object, visible, handleClose, action, onUpdate}) => {
  const handleEvent = () => {
    onUpdate();
    handleClose();
  }

  return (
    <ModalWrapper title={`Objeto: ${object.codigo}`} handleClose={handleClose} visible={visible}>
      {action === "update" && (<UpdateObjectForm object={object} onUpdate={onUpdate} />)}
      {action === "delete" && (<DeleteObjectForm onCancel={handleClose} onDelete={handleEvent} object={object} />)}
    </ModalWrapper>
  )
}

interface DeleteObjectProps {
  object: RoomObject
  onUpdate: Function,
  onCancel: Function
}


const DeleteObjectForm: React.FC<DeleteFormProps<RoomObject>> = ({object, onDelete, onCancel}) => {
  const [err, setErr] = useState('');
  const [show, setShow] = useState(false);


  const handleSubmit = () => {
    console.log(`delete object ${object.codigo}`)
    onDelete();
  }

  return (
    <>
      <div className="col-span-12">
        <p className="text-xl text-center">Esta seguro de que desea eliminar el objeto {object.codigo}?</p>
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

const UpdateObjectForm: React.FC<UpdateFormProps<RoomObject>> = ({object, onUpdate}) => {
  const [state, setState] = useState('');
  const [tipo, setTipo] = useState('');
  const [err, setErr] = useState('')
  const [show, setShow] = useState(false);

  const handleSubmit = () => {
    setShow(false)
    console.log({state: state, type: tipo})
    setErr('errorrrrr')
    setTimeout(() => {
      setShow(true)
    }, 4000)
  }

  useEffect(() => {
    setState(object.estado.toString());
    setTipo(object.tipo);
  }, [object])

  return (<>
    <div className="col-span-12 p-5">
        <FloatingLabelInput onChange={e => setState(e.currentTarget.value)} placeholder="Estado" type="text" value={state} />
      </div>
      <div className="col-span-12 p-5">
        <FloatingLabelInput onChange={e => setTipo(e.currentTarget.value)} placeholder="Tipo Objeto" type="text" value={tipo} />
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