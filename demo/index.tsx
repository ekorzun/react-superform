import * as React from 'react'
import {render} from 'react-dom'
import styled from 'styled-components'
import SuperForm from '../src/SuperForm'
import Rjv from 'react-json-tree-viewer'
const { useState } = React

const Box = styled.div`
  margin: 3rem;
  padding:1rem;
  border-radius: 3px;
  background-color: #fff;
  box-shadow: 0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12);
  display: flex;
  flex: 0 1 auto;
  flex-direction: row;
  flex-wrap: wrap;
  > div {
    padding: .5rem
  }
  > h1 {
    flex: 0 0 100%;
    margin-bottom: 0;
    font-weight: 500;
  }
  > h1 + div {
    flex: 0 0 75%
  }
  > div:last-child {
    flex: 0 0 25%
  }
`

const Code = styled.div`
  background-color: #eee;
  padding: 1rem;
`

// @ts-ignore
const Form = ({title, onChange, ...props}) => {
  const [state, setState] = useState({})
  return (
    <Box>
      {title && <h1>{title}</h1>}
      <div>
        <SuperForm 
          onChange={(e:any) => {
            setState(() => e.target.value)
            onChange && onChange(e)
          }}
          {...props} 
        />
      </div>
      <div>
        <Code><Rjv data={state} /></Code>
      </div>
    </Box>
  )
}

const App = () => {

  const [nestedState, setNestedState] = useState({
    name: '',
    age: 18,
    card: {
      cvc: 0,
      fio: {
        firstName: '',
        lastName: '',
      }
    }
  })

  return (
    <div>
      {/* @ts-ignore */}
      <Form
        title='default'
        defaultValue={{
          username: '',
          password: '',
        }}
      />

      <hr />

      {/* @ts-ignore */}
      {/* <Form
        title='Array'
        defaultValue={{
          FIO: '',
          items: [{
            title: '',
            count: 1,
          }]
        }}
      /> */}

      <hr />

      {/* @ts-ignore */}
      <Form
        title='default nested'
        noLabels
        schema={{
          age: {
            type: 'number',
            getValue: (e:any) => {
              return Number(e.target.value)
            }
          }
        }}
        layout={[
          ['name', 'age'],
          ['offset', 'card'],
        ]}
        defaultValue={{
          name: '',
          age: 18,
          card: {
            cvc: 0,
            fio: {
              firstName: '',
              lastName: '',
            }
          }
        }}
      /> 

      <hr />


      <Form
        title='Controlled nested'
        noLabels
        schema={{
          name: '',
          age: {
            type: 'number'
          },
          card: {
            type: 'object'
          }
        }}
        layout={[
          ['name', 'age'],
          ['offset', 'card'],
        ]}
        onChange={(e:any) => {
          setNestedState(e.target.value)
        }}
        value={nestedState}
      /> 



      
    
    </div>
  )
}



render(
  <App />, 
  document.getElementById('root')
)