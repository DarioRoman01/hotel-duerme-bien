export interface ModalProps<T> {
  object: T
  visible: boolean
  handleClose: any
  action: string
  onUpdate: Function
}

export interface DeleteFormProps<T> {
  object: T
  onDelete: Function
  onCancel: Function
}

export interface UpdateFormProps<T> {
  object: T
  onUpdate: Function
}