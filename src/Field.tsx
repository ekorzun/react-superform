import * as React from 'react'
import cx from 'classnames'
import { IField, IFieldRender, IFieldEvents, ITheme } from './types'
import Input from './Input'


const SuperFormField = ({
  theme = {} as ITheme,  
  disabled,
  field,
  state,
  schema,
  handlers,
  // errors = {},
  // warnings,
  // override,
  renderLabel,
  colIndex,
  rowIndex,
  noLabels,
}: IFieldRender & {
  colIndex: number
  rowIndex: number
  field: IField
  renderLabel ?: Function
  noLabels ?: boolean
  noHints ?: boolean
  disabled ?: boolean
  handlers?: IFieldEvents
} & {
  [key:string]: any
}) => {


    // const error = typeof errors === 'string'
    //   ? errors === field.name
    //     ? true
    //     : false
    //   : Array.isArray(errors)
    //     ? errors.indexOf(field.name) > -1
    //     : errors[field.name]
    
    const hasError = false
    const isDisabled = disabled
    const isHidden = false

    const Label = 'div'

    return (

      <Label
        className={cx(
          theme.field,
          hasError && theme.fieldInvalid,
          isDisabled && theme.fieldDisabled
        )}
      >

        {!noLabels && (
          <div
            className={cx(
              theme.label,
              hasError && theme.labelInvalid,
              isDisabled && theme.labelDisabled
            )}
          >
            {field?.label || field?.name}
          </div>
        )}

        <div
          className={cx(
            theme.input,
            hasError && theme.inputInvalid
          )}
        >
         <Input 
            field={field}
            colIndex={colIndex}
            rowIndex={rowIndex}
            handlers={handlers}
            state={state}
            schema={schema}
          />
        </div>
        {/* {noHints ? (null) : (
          <div className={cx(theme.hint, errors[item.name] && theme.commentInvalid)}>
            {
              Array.isArray(errors[item.name]) || typeof errors[item.name] === 'string'
                ? errors[item.name]
                : null
            }
          </div>
        )} */}
      </Label>
    )

}

export default SuperFormField