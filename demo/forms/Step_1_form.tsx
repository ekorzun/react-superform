import * as React from 'react'
import DefaultForm from "../DefaultForm";

const Step1Form = () => (
  <DefaultForm 
    title='Default value only'
    defaultValue={{
      username: '',
      password: '',
    }}
  />
)

export default Step1Form