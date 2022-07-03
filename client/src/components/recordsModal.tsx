import React, { useEffect, useState } from "react";
import { DeleteFormProps, ModalProps, UpdateFormProps } from "./utils";
import { deleteRequest, patchRequest, Record } from "../requests/requests";
import { ModalWrapper } from "./wrappers";
import { ErrorAlert } from "./error";
import { DatePicker } from "./datePickers";
import { Select } from "./select";

export const RecordsModal: React.FC<ModalProps<Record>> = ({object, action, handleClose, onUpdate, visible}) => {
  const handleEvent = () => {
    onUpdate();
    handleClose();
  }

  return (
    <ModalWrapper handleClose={handleClose} title={`Historial Habitacion: ${object.codigo_habitacion}`} visible={visible}>
      {action === 'update' && (<UpdateRecordForm object={object} onUpdate={handleEvent}/>)}
      {action === 'delete' && (<DeleteRecordForm onCancel={handleClose} onDelete={handleEvent} object={object} />)}
    </ModalWrapper>
  )
}

const UpdateRecordForm: React.FC<UpdateFormProps<Record>> = ({object, onUpdate}) => {
  const [state, setState] = useState('');
  const [finish, setFinish] = useState('');
  const [err, setErr] = useState('');
  const [show, setShow] = useState(false);

  useEffect(() => {
    setState(object.activa ? "activa" : "no activa");
    setFinish(object.fecha_termino.replace(' ', 'T'));
  }, [object]);

  const handleSubmit = () => {
    setShow(false);
    const body = {
      recordId: object.codigo,
      state: state,
      finish: finish
    }

    patchRequest<any>(body, 'records')
    .then(_ => onUpdate())
    .catch(err => {
      setErr(err.message)
      setShow(true)
    })
  }

  return (<>
    <div className="col-span-12 p-5">
      <Select options={[['1', 'activa'], ['0', 'no activa']]} selected={object.activa ? "1" : "0"} handleChange={e => setState(e.currentTarget.value)} />
      </div>
      <div className="col-span-12 p-5">
        <DatePicker label="Fecha Termino" type="datetime-local" value={finish}  onChange={e => setFinish(e.currentTarget.value.replace('T', ' '))}/>
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

const DeleteRecordForm: React.FC<DeleteFormProps<Record>> = ({object, onCancel, onDelete}) => {
  const [err, setErr] = useState('');
  const [show, setShow] = useState(false);

  const handleSubmit = () => {
    setShow(false)
    deleteRequest(`records?record=${object.codigo}`)
    .then(_ => onDelete())
    .catch(err => {
      setErr(err.message)
      setShow(true)
    })
  }

  return (
    <>
      <div className="col-span-12">
        <p className="text-xl text-center">Esta seguro de que desea eliminar el registro de la habitacion {object.codigo_habitacion}?</p>
      </div>
      <div className="col-span-12 p-5">
        <div className="flex justify-between">
          <div className="w-full flex justify-center">
            <button onClick={_ => onCancel()} className="w-[45%] text-contrast bg-secondary hover:bg-secondary text-last font-bold py-2 px-4 rounded">
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
    </>
  )
}