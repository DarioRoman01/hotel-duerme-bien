// util interface to make a generic props modal where the only thin that changes is the object like room, client etc.
export interface ModalProps<T> {
  object: T
  visible: boolean
  handleClose: any
  action: string
  onUpdate: Function
}

// same as modal props but for objects deletion
export interface DeleteFormProps<T> {
  object: T
  onDelete: Function
  onCancel: Function
}

// same as modal props but for update objects
export interface UpdateFormProps<T> {
  object: T
  onUpdate: Function
}