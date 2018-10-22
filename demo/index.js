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

  render() {
    return (
      <SuperForm
        defaultValue={this.state}
        schema={this.schema}
        onChange={this.handleChange}
        layout={[
          ['email', 'name'],
          ['age']
        ]}
        theme={{
          container: 'container',
          row: 'row',
          col: 'col',
        }}
      />
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))