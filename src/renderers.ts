import * as React from 'react'

export const renderers:{
  [key:string]: Function
} = {}

export const setRenderer = (
  types:string|string[],
  InputComponent: Function
) => {
  (Array.isArray(types) ? types : [types]).forEach(type => {
    renderers[type] = InputComponent
  })
}