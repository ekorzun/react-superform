import * as React from 'react'
import DefaultForm from "../DefaultForm";

const Step2Form = () => (
  <>
    <DefaultForm
      title='Default value + layout'
      defaultValue={{
        username: '',
        password: '',
      }}
      layout={[['username','password']]}
    />
  </>
)

export default Step2Form