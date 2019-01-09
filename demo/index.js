import React from 'react'
import ReactDOM from 'react-dom'
import {SuperForm} from '../src/index'

import connect, {Model, setConfig} from 'react-supermodel'
import Baobab from 'baobab'

const tree = new Baobab({
  $api: {}
})

setConfig({tree})

const X = new Model({
  name: 'xxx',
  api: {},

})

class NumberInput extends React.Component {
  render(){
    const {value, name, onChange, onFocus, children} = this.props
    return (
      <div style={{background:'#eeffee'}}>
        <input
          type='number'
          value={value}
          onChange={onChange}
          name={name}
          onFocus={onFocus}
        />
      </div>
    )
  }
}

const CNumberInput2 = connect(X)(NumberInput)

const EmailInput = ({
  value,
  onChange,
  name,
  item,
}) => {
  return (
    <div>
      <input
        type='email'
        placeholder='user@example.com'
        value={value}
        onChange={onChange}
        name={name}
      />
    </div>
  )
}


// SuperForm.setRenderer(['number'], a => <CNumberInput2 {...a} />)
// SuperForm.setRenderer(['email'], EmailInput)




SuperForm.setRenderer('select', props => {
  const {item} = props
  return (
    <select 
    value={props.value}
    name={props.name} onChange={props.onChange}>
      {item.options.map((opt, i) => 
        <option value={i} key={i}>{opt}</option>
      )}
    </select>
  )
})



SuperForm.setRenderer('custom-email', props => {
  console.log('props: ', props);
  return (
    <div>
      <h2>КАСТОМНЫЙ ЕМЕЙЛ</h2>
      <h3>
        <input 
          style={{
            color: 'blue',
            fontSize: 20
          }}
          type='text' 
          name={props.name}
          value={props.value}
          onChange={e => {
            const {name, value} = e.target
            props.onChange({
              target: {
                name, 
                value
              }
            })
          }}
        />
      </h3>
    </div>
  )
})

class App extends React.Component {

  schema = {
    age: {
      label: 'Возраст',
      type: 'number',
      min: 1,
      max: 100,
      required: true,
    }
  }

  constructor(props){
    super(props)
    this.state = {
      users: [
        {name: '', email: 'xxxx', age: 0}
      ],

      form: {
        name: '',
        email: '',
        age: 18,
        sex: '2'
      }
    }
  }

  handleChange2 = ({name, value}, index) => {
    const users = this.state.users.slice(0)
    users[index][name] = value
    this.setState({
      users
    })
  }

  handleSubmit = (e) => {
    e && e.preventDefault()
    alert(JSON.stringify(this.state))
  }

  validate2222 = (data, keyMode) => {
    if(data.age < 21) {
      return "Нелья быть младше 21"
    }
  }

  validate = (data, keyMode) => {
    if(data.age < 21) {
      return {age: "Нелья быть младше 21"}
    }
  }

  hide = (state, keyMode) => {
    if(state.age < 21) {
      return {credit: 1}
    }
  }

  pushUser = (e) => {
    e && e.preventDefault()
    this.setState({
      users: [...this.state.users, {name:'', email: '', age: 0}]
    })
  }

  handleDeleteClick = props => {
    const {users} = this.state
    const {index} = props
    this.setState({
      users: users.filter((user, i) => i !== index)
    })
  }


  render123123(){
    return (
      <SuperForm 
        onChange={e => {
          const {name, value} = e
          this.setState({
            form: {
              ...this.state.form,
              [name]: value
            }
          })
        }}
        onSubmit={e => {
          alert(JSON.stringify(
            e, null, 2
          ))
        }}
        schema={{
          name: {
            required: true,
            label: 'Введите ваше имя',
          },
          email: {
            type: 'custom-email',
          },
          sex: {
            type: 'select',
            label: 'Пол',
            options: ['выберете', 'женский', 'мужской']
          }
        }}
        overrideMap={{
          email: 'string'
        }}
        value={this.state.form}
        theme={{
          container: 'container',
          row: 'row',
          col: 'col',
          label: 'label',
          labelInvalid: 'labelInvalid',
        }} 

      >
        {JSON.stringify(this.state.form)}
        <button type='submit'>Отправить</button>
      </SuperForm>
    )
  }

  render() {
    const {users} = this.state
    return (
      <form onSubmit={this.handleSubmit}>
        {users.map((user, index) => {
          return (
            <SuperForm
              Component='div'
              className='animated fadeInUp'
              key={index}
              index={index}
              schema={this.schema}
              hidden={this.hide(user)}
              overrideMap={{
                'credit': () => 'Ввод кредитной карты',
                'email': 'email',
                'delete': (props) => (
                  <h3 onClick={e => {
                    this.handleDeleteClick(props)
                  }}>
                    УДОЛИТЬ
                  </h3>
                )
              }}
              value={user}
              onChange={this.handleChange2}
              validate={this.validate}
              validateOn='change'
              layout={[
                ['email', 'name', 'age', 'delete'],
                ['credit']
              ]}
              theme={{
                container: 'container',
                row: 'row',
                col: 'col',
                label: 'label',
                labelInvalid: 'labelInvalid',
              }} 
            />
          )
        })}
        <button onClick={this.pushUser}>+</button>
        <button type='submit'>SAVE</button>
      </form>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))