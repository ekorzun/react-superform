import * as React from 'react'
import { IField, IFieldRender, IFieldEvents } from './types'
import { renderers } from './renderers'

const SuperFormInput = ({
  field,
  handlers,
  state,
  colIndex,
  rowIndex,
  ...other
}:{
  handlers: undefined | IFieldEvents
  field: IField
  colIndex: number
  rowIndex: number
} & {
  [key:string]: any
}) => {
  
  const {type, name} = field
  console.log("const {type, name} = field", type, name)
  const value = state[name]
  

  const render = (
    // Array of Inputs
    type === 'array'
      ? 
        // arrayOfType - custom 
        renderers[`arrayOf${field.of}`] 
        // default
        || renderers[type]
      : renderers[type]
  )

  return render && render({
    value, //: value === undefined ? '' : value,
    field,
    ...field,
    ...handlers,
    ...other,
    onChange: (e:any) => {
      handlers
        ?.onChange
        ?.(e, field, rowIndex, colIndex)
    }
  }) || `Unsupported input type ${type}`
}

export default SuperFormInput