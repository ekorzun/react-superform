import * as React from 'react'

import Step_1_form from './forms/Step_1_form'
import Step_2_form from './forms/Step_2_form'
import Step_3_form from './forms/Step_3_form'
import Step_4_form from './forms/Step_4_form'
import Step_5_form from './forms/Step_5_form'
import './renderers'

const { useState } = React

const App = () => {


  return (
    <div>
      <Step_1_form />
      <Step_2_form />
      <Step_3_form />
      <Step_4_form />
      <Step_5_form />
    
    </div>
  )
}


export default App