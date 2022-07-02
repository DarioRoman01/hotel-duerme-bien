import React, { useEffect, useState } from "react";
import { deleteRequest, patchRequest, RoomObject } from "../requests/requests";
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

const DeleteObjectForm: React.FC<DeleteFormProps<RoomObject>> = ({object, onDelete, onCancel}) => {
  const [err, setErr] = useState('');
  const [show, setShow] = useState(false);


  const handleSubmit = () => {
    setShow(false)
    deleteRequest<any>(`objects?objectId=${object.codigo}`)
    .then(_ => onDelete)
    .catch(err => {
      setErr(err)
      setShow(true)
    })
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
  const [err, setErr] = useState('');
  const [show, setShow] = useState(false);

  const handleSubmit = () => {
    setShow(false)
    const body = {
      state: state,
      type: tipo,
      objectId: object.codigo
    }

    patchRequest<any>(body, 'objects')
    .then(_ => onUpdate())
    .catch(err => {
      setErr(err)
      setShow(true)
    })
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