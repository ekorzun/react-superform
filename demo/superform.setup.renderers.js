import React, {Component} from 'react'
import { SuperForm } from '../src/index'
import { CREDIT_CARD_SCHEMA, ADDRESS_SCHEMA } from './superform.schema';

// Кредитная карта
SuperForm.setRenderer('creditcard', props => {
  return (
    <SuperForm
      Component='div'
      schema={CREDIT_CARD_SCHEMA}
      errors={props.namedErrors}
      onFocus={props.onFocus}
      value={props.value}
      theme={{
        hint: 'hint-micro'
      }}
      onChange={(e, patch, state, index) => {
        props.onChange({
          target: {
            name: props.name,
            value: state.value
          }
        })
      }}
      name={props.name}
      layout={[
        'number',
        ['date', 'offset', 'cvc'],
        ['name']
      ]}
    />
  )
})


// Кредитная карта
SuperForm.setRenderer('address', props => {
  return (
    <SuperForm
      Component='div'
      noHints
      schema={ADDRESS_SCHEMA}
      onFocus={props.onFocus}
      theme={{
        hint: 'hint-micro'
      }}
      onChange={(e, patch, state, index) => {
        props.onChange({
          target: {
            name: props.name,
            value: state.value
          }
        })
      }}
      name={props.name}
      layout={[
        'city:6',
        'street',
        'zipcode',
      ]}
    />
  )
})


// Пустой элемент формы для лэйаута
SuperForm.setRenderer('offset', a => null)

// Пример простого селекта
SuperForm.setRenderer('select', props => {
  const { item } = props
  const {labelKey = 'label', valueKey = 'value'} = item
  const options = typeof item.options === 'function'
    ? item.options() : item.options
  return (
    <select
      value={props.value}
      name={props.name}
      onChange={props.onChange}
    >
      {options.map((option, i) => {
        const opt = option.data || option
        return <option value={opt[valueKey] || i} key={opt[valueKey] || i}>{opt[labelKey]}</option>
      })}
    </select>
  )
})

// Пример радио инпута
SuperForm.setRenderer('radio', props => {
  const { item } = props
  const { labelKey = 'label', valueKey = 'value' } = item
  return (
    <div
      value={props.value}
      name={props.name}>
      {item.options.map((opt, i) =>
        <label key={i}>
          <input 
            type='radio' 
            onFocus={props.onFocus}
            name={props.name}
            value={opt[valueKey]} 
            onChange={props.onChange} 
            />
          {opt[labelKey]}
        </label>
      )}
    </div>
  )
})

// Пример чекбокса
SuperForm.setRenderer(['checkbox', 'boolean', 'bool'], props => {
  const { item } = props
  return (
    <label key={i}>
      <input type='checkbox' 
        name={props.name}
        value={props.value} 
        onChange={props.onChange} 
      />
      {item.label}
    </label>
  )
})


SuperForm.setRenderer('phone', class PhoneInputExample extends Component {
  state = {
    code: '',
    number: '',
  }
  handleChange = e => {
    const {name, value} = e.target
    this.setState({[name]: value})
    const {onChange, item} = this.props
    onChange({
      target: {
        name: `phone_${name}`,
        value: value
      }
    })
    setTimeout(() => {
      const { code, number } = this.state
      onChange({
        target: {
          name: item.name,
          value: `${code}${number}`
        }
      })
    })
  }
  render(){
    const {number, code} = this.state
    return (
      <div>
        +7 <input 
          onChange={this.handleChange} 
          name='code' 
          value={code}
          />
          <input 
          onChange={this.handleChange} 
          name='number' 
          value={number}
          />
      </div>
    )
  }
})