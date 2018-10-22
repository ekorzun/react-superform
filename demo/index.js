import React from 'react'
import ReactDOM from 'react-dom'
import {SuperForm} from '../src/index'

class App extends React.Component {
  render() {
    return (
      <SuperForm
        defaultValue={{
          name: '',
          email: ''
        }}
        layout={[
          ['name', 'email',]
        ]}
      />
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))