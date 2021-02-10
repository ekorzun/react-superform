import * as React from 'react'
import { IField, IFieldRender, IFieldEvents } from './types'
import { renderers } from './renderers'

// console.log("renderers", renderers)

const SuperFormInput = ({
  // field,
  handlers,
  state,
  colIndex,
  rowIndex,
  renderAs,
  name,
  type,
  ...other
}:{
  handlers: undefined | IFieldEvents
  field: IField
  colIndex: number
  rowIndex: number
} & {
  [key:string]: any
}) => {
  

  const value = state[name]

  let render = null

  if( type === 'array' ) {
    render = renderers[renderAs]
      || renderers[`arrayOf${renderAs}`] 
      || (other?.of && renderers[`arrayOf${other.of}`])
      || renderers[type]

      // console.log(
      //   name, ':', type, ':',
      //   renderers[renderAs] 
      //     ? renderAs
      //     : renderers[`arrayOf${renderAs}`] 
      //       ? `arrayOf${renderAs}`
      //       : renderers[`arrayOf${field.of}`]
      //         ? `arrayOf${field.of}`
      //         : type
      // )
  } else {
    render = renderers[renderAs]
      || renderers[type]
  }


  return render && render({
    state,
    name,
    value, //: value === undefined ? '' : value,
    // field,
    // ...field,
    ...other.field,
    ...handlers,
    ...other,
    onChange: (e:any, field) => {
      handlers
        ?.onChange
        ?.(e, 
          field || other.field, 
          rowIndex, 
          colIndex
        )
    }
  }) || (
      <span style={{
        color: 'red'
      }}>
        Unsupported input type: <strong>
          {type}
        </strong>
      </span>
    )
}

export default SuperFormInput