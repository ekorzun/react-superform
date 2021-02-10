import * as React from 'react'
import cx from 'classnames'
import { IField, IFieldRender, IFieldEvents, ITheme } from './types'
import Input from './Input'
import { log } from './utils'


const SuperFormField = ({
  theme = {} as ITheme,
  disabled,
  field,
  state,
  schema,
  handlers,
  errors,
  // warnings,
  // override,
  renderLabel,
  colIndex,
  rowIndex,
  noLabels,
  layoutField,
  hide,
}: IFieldRender & {
  colIndex: number
  rowIndex: number
  field: IField
  renderLabel?: Function
  noLabels?: boolean
  noHints?: boolean
  disabled?: boolean
  handlers?: IFieldEvents
} & {
  [key: string]: any
}) => {

  // log(`SuperFormField:render:field`, field)
  // log(`SuperFormField:render:layoutField`, layoutField)


  // if (!field) {
  //   return (
  //     <span style={{ color: 'red' }}>
  //       No <strong>{layoutField.name}</strong> found in schema
  //     </span>
  //   )
  // }

  

  
  const isDisabled = disabled
  const isHidden = false

  const Label = 'div'
  
  const type = layoutField?.type || field?.type
  const renderAs = layoutField?.renderAs || field?.type
  const name = field?.name || layoutField?.name
  const noLabel = field?.noLabel || layoutField?.noLabel || noLabels

  const error = errors[name] || (typeof errors === 'string'
    ? errors === field.name
      ? true
      : false
    : Array.isArray(errors)
      ? errors.indexOf(field.name) > -1
      : errors[field.name])

  const hasError = !!error

  return (

    <Label
      className={cx(
        theme.field,
        hasError && theme.fieldInvalid,
        isDisabled && theme.fieldDisabled
      )}
    >

      {!noLabel && (
        <div
          className={cx(
            theme.label,
            hasError && theme.labelInvalid,
            isDisabled && theme.labelDisabled
          )}
        >
          {
            // Field's label could be string or function
            field?.label !== undefined
              ? (
                typeof field.label === 'function'
                  ? field.label(field, colIndex, rowIndex)
                  : field.label
              ): field?.name
          }
        </div>
      )}

      <div
        // style={{
        //   padding: '1rem',
        //   border: '1px dashed black'
        // }}
        className={cx(
          theme.input,
          hasError && theme.inputInvalid,
        )}
      >
        {/* input: {type}/{name}/{JSON.stringify({error, errors, hasError})} */}
        <Input
          field={field}
          renderAs={renderAs}
          name={name}
          type={type}
          of={field?.of}
          colIndex={colIndex}
          rowIndex={rowIndex}
          handlers={handlers}
          state={state}
          schema={schema}
          errors={errors}
          error={error}
          hide={hide}
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