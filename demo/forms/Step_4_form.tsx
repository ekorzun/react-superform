import * as React from 'react'
import DefaultForm from "../DefaultForm";



const Step4Form = () => {
  const [isValid, setValid] = React.useState(false)
  const validate = React.useCallback(e => {
    const { password_confirmation, password} = e.target.value
    setValid(!!password && password === password_confirmation)
  }, [])

  return (
    <>
      <DefaultForm
        title='Default value + layout + override render type from layout'
        onChange={validate}
        defaultValue={{
          username: '',
          password: '',
          password_confirmation: '',
        }}
        layout={[
          'username',
          [
            'password->password', 
            'password_confirmation->password'
          ]
        ]}
      >
      {isValid ? (
        <span style={{ color: 'green' }}>Valid</span>
      ) : 2}
      </DefaultForm>
    </>
  )
}

export default Step4Form