

import * as React from 'react'
const { Fragment, useEffect, useMemo, useState, useCallback } = React

import {
  makeSchema,
  makeLayout,
  uniqId,
  noop,
  nearest
} from './utils'

import { WithLayout } from './WithLayout'
import Layout from './Layout'
import { setRenderer } from './renderers'
import { ITheme } from './types'


type IAny = {
  [key:string]: any
}

setRenderer('string', ({
  onChange,
  value,
  name,
}: IAny) => <input name={name} value={value} onChange={onChange} />)

setRenderer('number', ({
  onChange,
  value,
  name,
}: IAny) => <input type='number' name={name} value={value} onChange={onChange} />)

setRenderer(['object'], ({
  onChange,
  value,
  name,
  schema
}: IAny) => (
  <SuperForm
    name={name}
    schema={schema}
    defaultValue={value}
    onChange={onChange}
  />
))


const useArrayOf = (field: any, schema: any, onChange: any) => {
  // console.log('field', schema[`__${field.of}`])
  return useMemo(() => {
    const subschema = schema[`__${field.of}`]
    return {
      subschema,
      push: (Value: any) => {
        const newItem = Object.values(subschema)
          .filter((p: any) => p.defaultValue !== undefined)
          .reduce((acc: any, prop: any) => {
            acc[prop.name] = prop.defaultValue
            return acc
          }, {})

        console.log(newItem)

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
  }, [field, schema])
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
  } = useArrayOf(field, schema, onChange)

  return (
    <Fragment>
      {(Value || []).map((v: any, index: any) => {
        return (
          <div key={index}>

            <button onClick={e => {
              e.preventDefault()
              remove(Value, index)
            }}>delete</button>
            {/*
                {index}. {of} – {JSON.stringify(v)}:
            */}
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
    </Fragment>
  )
})


const useSchema = (schema: any, state: any) => {
  return useMemo(() => {
    return makeSchema(schema, state)
  }, [schema, state])
}

const useLayout = (layout: any, schema: any) => {
  return useMemo(() => {
    return makeLayout(layout, schema)
  }, [schema])
}




const SuperForm = ({
  value,
  defaultValue,
  layout,
  schema,

  theme = {},

  onChange,
  name,
  noLabels,

}: {
  [key:string]: any,
  theme ?: ITheme
}) => {

  const isControlled = value !== undefined
  const [state, setState] = useState(isControlled ? {} : { ...defaultValue, ...value })

  useEffect(() => {
    if (!onChange || isControlled) {
      return
    }
    onChange({
      target: {
        name,
        value: state
      }
    })
  }, [state])

  const _schema = useSchema(schema, state)
  const _layout = useLayout(layout, _schema)

  if (isControlled && name === 'card') {
    console.log('value', value)
    console.log('_schema', _schema)
  }

  const handlers = {
    onChange: (eventLike: any, field: any) => {
      console.log('onChange', eventLike)
      const { target } = eventLike
      if (isControlled) {
        return onChange && onChange({
          target: {
            name,
            value: {
              ...value,
              [target.name]: field?.getValue?.(eventLike, field) || target.value
            }
          }
        })
      }

      if (target) {
        const { name: targetName, value: targetValue } = target
        setState((prevState: any) => {
          return {
            ...prevState,
            [targetName]: field?.getValue?.(eventLike, field) || target.value
            // targetValue
          }
        })
      }
    }
  }


  return (
    <div style={{
      border: isControlled ? '1px solid' : 0
    }}>
      <WithLayout>
        {() => (
          <Layout
            layout={_layout}
            schema={_schema}
            theme={theme}
            handlers={handlers}
            state={isControlled ? value : state}
            noLabels={noLabels}
          />
        )}
      </WithLayout>
    </div>
  )
}

export default SuperForm