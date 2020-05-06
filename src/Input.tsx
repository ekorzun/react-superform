import * as React from 'react'
import { IField, IFieldRender, IFieldEvents } from './types'
import { renderers } from './renderers'

const SuperFormInput = ({
  field = {},
  handlers,
  state,
  ...other
}:{
  handlers: undefined | IFieldEvents
  field: IField
  colIndex: number
  rowIndex: number
}) => {
  const {type, name} = field
  const value = state[name]

  const render = (
    type === 'array'
      ? renderers[`arrayOf${field.of}`] || renderers[type]
      : renderers[type]
  )

  return render && render({
    value, //: value === undefined ? '' : value,
    field,
    ...field,
    ...handlers,
    ...other
  }) || `Unsupported input type ${type}`
}

export default SuperFormInput