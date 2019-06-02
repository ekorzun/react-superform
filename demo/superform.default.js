import React from 'react'
import { SuperForm } from '../src/index'
import './superform.setup.renderers'

export default props => (
  <SuperForm
    validateOn='submit'
    style={{
      position: 'relative'
    }}
    theme={{
      container: 'container',
      row: 'row',
      col: 'col',
      label: 'label',
      labelInvalid: 'labelInvalid',
      labelDisabled: 'labelDisabled',
      hint: 'hint'
    }}
    {...props}
  >
    <button type='submit'>
      Отправить
          </button>
  </SuperForm>
)