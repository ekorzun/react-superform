import * as React from 'react'
import DefaultForm from "../DefaultForm";

const Step3Form = () => (
  <>
    <DefaultForm
      title='Default value + layout + override render type from layout'
      defaultValue={{
        user: '',
        pass: '',
      }}
      layout={[['user', 'pass->password']]}
    />
  </>
)

export default Step3Form