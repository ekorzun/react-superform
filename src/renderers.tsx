import * as React from 'react'
import { SuperForm } from './SuperForm'
import { IAny } from './types'
import { makeLayout, makeSchema } from './utils'

const {
  useMemo
} = React

export const renderers: {
  [key: string]: Function
} = {}

// 
// 
// 
export const setRenderer = (
  types: string | string[],
  InputComponent: Function
) => {
  (Array.isArray(types) ? types : [types]).forEach(type => {
    if(
      type === 'offset'
    ) {
      throw new Error(`Type "${type}" is reserved`)
    }
    renderers[type] = InputComponent
  })
}

// 
// 
// 
setRenderer('string', ({
  onChange,
  value,
  name,
}: IAny) => <input name={name} value={value} onChange={onChange} />)

// 
// 
// 
setRenderer('number', ({
  onChange,
  value,
  name,
}: IAny) => <input type='number' name={name} value={value} onChange={onChange} />)

// 
// 
// 
setRenderer(['object'], ({
  onChange,
  value,
  name,
  schema,
  ...props
}: IAny) => {

  return (
    <>
      <div>schema: {JSON.stringify(schema)}</div>
      <div>name: {JSON.stringify(name)}</div>
      <div>value: {JSON.stringify(value)}</div>
      <div>other: {JSON.stringify(props)}</div>
      <SuperForm
        name={name}
        schema={schema}
        defaultValue={value}
        onChange={onChange}
        {...props}
      />
    </>
  )
})







const useArrayOf = (field: any, schema: any, onChange: any) => {
  // console.log('field', schema[`__${field.of}`])
  // return useMemo(() => {

  const subschema = schema[`__${field.of}`] || schema[`${field.of}`] || {}

    console.log('subschema', subschema, field, schema)

    return {
      subschema,

      push: (Value: any) => {
        const newItem = Object.values(subschema)
          .filter((p: any) => p.defaultValue !== undefined)
          .reduce((acc: any, prop: any) => {
            acc[prop.name] = prop.defaultValue
            return acc
          }, {})

        // console.log(newItem)

        onChange({
          type: 'add',
          name: field.name,
          target: { 
            name: field.name,
            value: [...(Value || []), newItem],
          },
        })
      },
      update: (e: any, Value: any, index: any) => {
        const { name, value: itemValue } = e.target
        const newValue = Value.map((item: any, i: any) => {
          return i !== index ? item : {
            ...item,
            ...itemValue
          }
        })

        onChange({
          index,
          type: 'update',
          target: {
            name,
            value: newValue
          },
        })
      },
      remove: (Value: any, index: any) => {
        onChange({
          type: 'remove',
          name: field.name,
          target: {
            name: field.name,
            value: Value.filter((x: any, i: any) => i !== index)
          },
        })
      }

    }

  // }, [field, schema])
}




setRenderer('array', ({
  onChange,
  value: Value,
  name,
  field,
  schema,
}: IAny) => {

  const {
    push,
    remove,
    update,
    subschema
  } = useArrayOf(
    field, 
    schema, 
    onChange
  )


  // console.log('asdasd', subschema)

  return (
    <>
      {(Value || []).map((v: any, index: any) => {
        return (
          <div key={index}>

            <button onClick={e => {
              e.preventDefault()
              remove(Value, index)
            }}>delete</button>
            
                {index}. - {JSON.stringify(v)}:
           
            <SuperForm
              name={name}
              index={index}
              schema={subschema}
              value={v}
              onChange={(e: any) => {
                update(e, Value, index)
              }}
            />
          </div>
        )
      })}
      <button onClick={e => {
        e.preventDefault()
        push(Value)
      }}>+ new item</button>
    </>
  )
})