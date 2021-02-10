

import * as React from 'react'
const { Fragment, useEffect, useMemo, useState, useCallback } = React

import {
  makeSchema,
  makeLayout,
  uniqId,
  noop,
  nearest
} from './utils'

import './renderers'

import { WithLayout } from './WithLayout'
import Layout from './Layout'
import { IAny, ITheme } from './types'




const useSchema = (schema: any, state: any) => {
  return useMemo(() => {
    return makeSchema(schema, state)
  }, [schema])
}

const useLayout = (layout: any, schema: any) => {
  return useMemo(() => {
    return makeLayout(layout, schema)
  }, [layout, schema])
}






export const SuperForm = ({
  value,
  defaultValue,
  layout,
  schema,

  theme = {},

  onChange,
  name,
  noLabels,

  children = null,

  onFieldChange,
  onFormChange,
  onSubmit,

  hideStrategy = 'offset', // empty
  hide,
  Component = 'div',
  errors = {}

}: {
  [key: string]: any,
  theme?: ITheme
}) => {

  //Form is controlled whenever we have `value` prop
  const isControlled = value !== undefined

  // Every Form has its own data state.
  // So the base concept...
  // @todo: add description here
  const [state, setState] = useState(
    isControlled 
      ? { ...defaultValue} 
      : { ...defaultValue, ...value }
  )

  
  // 
  const _schema = useSchema(schema, state)
  // console.log(`SuperForm:render:schema`, _schema)

  // 
  // Layout can be layout as array of arrays/strings or function
  // that returns layout object
  // const _layout = typeof layout === 'function'
  //   ? useLayout(layout(_schema), _schema)
  //   : useLayout(layout, _schema)

  // const _layout = makeLayout(layout, _schema)
  // const _layout = useMemo(() => makeLayout(layout, _schema), [_schema])
  const _layout = useMemo(() => makeLayout(typeof layout === 'function' ? layout(state, _schema) : layout, _schema), [_schema, state])

  // console.log(`SuperForm:render:_layout`, _layout)

  // if (isControlled && name === 'card') {
  //   console.log('value', value)
  //   console.log('_schema', _schema)
  // }

  const handlers = {
    onChange: (eventLike: any, field: any) => {
      const { target } = eventLike

      // console.log('onChange', eventLike)
      // if (isControlled) {
      //   return onChange && onChange({
      //     target: {
      //       name: eventLike.target.name,
      //       value: field?.getValue?.(eventLike, field) || target.value
      //     }
      //   })
      // }

      

      if (target) {
        
        
        onFieldChange?.(eventLike, field)

        const { name: targetName, value: targetValue } = target

        setState((prevState: any) => {
          return {
            ...prevState,
            [targetName]: field?.getValue?.(eventLike, field) || targetValue
            // targetValue
          }
        })
      }
    }
  }

  useEffect(() => {
    onFormChange?.({
      target: {
        name,
        value: state
      }
    })
  }, [state])



  return (
    <Component onSubmit={onSubmit} style={{
      // border: isControlled ? '1px solid' : 0
    }}>
      <Layout
        layout={_layout}
        schema={_schema}
        theme={theme}
        handlers={handlers}
        state={isControlled ? value : state}
        noLabels={noLabels}
        hideStrategy={hideStrategy}
        hide={hide}
        errors={errors}
      />
      {children}
    </Component>
  )
}

export default SuperForm