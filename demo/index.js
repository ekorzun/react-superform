import React from 'react'
import ReactDOM from 'react-dom'
import {SuperForm} from '../src/index'

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
      name: '',
      email: 'xxxx',
      age: 18,
    }
  }

  handleChange = ({name, value}) => {
    this.setState({
      [name]: value
    })
  }

  handleSubmit = (data, e) => {
    alert(JSON.stringify(data))
  }

  validate = (data, keyMode) => {
    const errs = {}
    if(data.age < 21) {
      return "Младше 45"
    }
  }

  render() {
    return (
      <SuperForm
        schema={this.schema}
        defaultValue={this.state}
        onChange={this.handleChange}
        onSubmit={this.handleSubmit}
        validate={this.validate}
        validateOn='change'
        layout={[
          ['email', 'name'],
          ['email', 'name'],
          ['age'],
          ['email', 'name', 'email', 'name'],
        ]}
        theme={{
          container: 'container',
          row: 'row',
          col: 'col',
          label: 'label',
          labelInvalid: 'labelInvalid',
        }}
      >
        <button type='submit'>SAVE</button>
      </SuperForm>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))