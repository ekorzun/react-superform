import React from 'react'
import ReactDOM from 'react-dom'
import './index.setup'

import Form from './superform.default'
import SCHEMA from './superform.schema'

class App extends React.Component {

  state = {
    value: {
      card: {
        number: ""
      }
    }
  }

  hide = (state, keyMode) => {
    if (state.age < 21) {
      return { credit: 1 }
    }
  }

  disable = (state, keyMode) => {
    if (!state.email) {
      return { name: 1 }
    }
  }

  pushUser = (e) => {
    e && e.preventDefault()
    this.setState({
      users: [...this.state.users, { name: '', email: '', age: 0 }]
    })
  }

  handleDeleteClick = props => {
    const { users } = this.state
    const { index } = props
    this.setState({
      users: users.filter((user, i) => i !== index)
    })
  }

  handleChangeNew = (e, payload, state) => {
    const {value} = this.state
    this.setState({
      value: {
        ...value,
        [payload.name]: payload.value
      }
    })
  }


  getHiddenFields = () => {
    const { isBillingAddressDifferent } = this.state
    if (!isBillingAddressDifferent) {
      return { billing_address: true}
    }
  }

  render() {
    const { value } = this.state
    return (
      <div>
        <pre className='debug'>
          {JSON.stringify(value, null, 2)}
        </pre>
        <Form
          schema={SCHEMA}
          onChange={this.handleChangeNew}
          onSubmit={this.handleSubmit}
          defaultValue={value}
          isHidden={this.getHiddenFields()}
          layout={[
            'header_contact',
            ['name', 'fname', 'mname'],
            ['phone'],
            'header_billing',
            ['card', 'address'],
            'different_address',
            'billing_address',
          ]}
          
          override={{
            gender: 'radio',
            different_address: () => <label><input type='checkbox' onChange={e => this.setState({ isBillingAddressDifferent: e.target.checked})} /> Платежный адрес отличается</label>,
            header_billing: () => <h2>Платежная инфа</h2>,
            header_contact: () => <h2>Контактная инфа</h2>,

            floating_xer: () => {
              return (
                <div style={{
                  position: 'absolute',
                  width: 50,
                  height: 50,
                  borderRadius: 10,
                  background: 'red',
                  color: 'white',
                  top: 30,
                  right: 30
                }}
                onClick={e => {
                  this.handleChangeNew(e, {
                    name: 'red-xer-clicked',
                    value: 1
                  })
                }}
                >
                +
                </div>
              )
            }
          }}
        >
          <button type='submit'>
            Отправить
          </button>
        </Form>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))