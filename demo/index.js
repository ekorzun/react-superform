import React from 'react'
import ReactDOM from 'react-dom'
import {SuperForm} from '../src/index'


const NumberInput = ({
  value,
  onChange,
  name,
  item,
}) => {
  return (
    <div>
      <input
        type='number'
        value={value}
        onChange={onChange}
        name={name}
      />
    </div>
  )
}
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

// SuperForm.setRenderer(['number'], NumberInput)
SuperForm.setRenderer(['email'], EmailInput)

class App extends React.Component {

  schema = {
    age: {
      label: 'Возраст',
      type: 'number',
      min: 18,
      max: 65,
      required: true,
    }
  }

  constructor(props){
    super(props)
    this.state = {
      users: [
        {name: '', email: 'xxxx', age: 0}
      ]
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

  validate = (data, keyMode) => {
    const errs = {}
    if(data.age < 21) {
      return "Нелья быть младше 21"
    }
  }

  pushUser = (e) => {
    e && e.preventDefault()
    this.setState({
      users: [...this.state.users, {name:'', email: '', age: 0}]
    })
  }

  render() {
    const {users} = this.state
    return (
      <form onSubmit={this.handleSubmit}>
        {users.map((user, index) => {
          return (
            <SuperForm
              Component='div'
              key={index}
              index={index}
              schema={this.schema}
              overrideMap={{
                'email': 'email'
              }}
              defaultValue={user}
              onChange={this.handleChange2}
              validate={this.validate}
              validateOn='change'
              layout={[
                ['email', 'name', 'age'],
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