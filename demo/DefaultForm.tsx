import { Accordion, AccordionDetails, AccordionSummary, Collapse } from '@material-ui/core'
import * as React from 'react'
import Rjv from 'react-json-tree-viewer'
import { SuperForm } from '../src'
import Box from './components/Box'
import Code from './components/Code'

export const DefaultForm = ({
  title = '',
  onChange = (e: any) => e,
  children = null,
  ...props
}) => {
  const [state, setState] = React.useState({})
  return (
    <Box>
      <div style={{ flexBasis: '60%' }}>

        <div>
          {title && <h1>{title}</h1>}
          <SuperForm
            theme={{
              container: 'container',
              row: 'row',
              col: 'col',
              label: 'label',
              labelInvalid: 'labelInvalid',
              labelDisabled: 'labelDisabled',
            }}
            onFieldChange={(e: any) => {
              setState(p => {
                console.log(p, e)
                return { ...p, [e.target.name]: e.target.value }
              })
              onChange && onChange(e)
            }}
            {...props}
          />
          {children}
        </div>
      </div>
      <div style={{ flexBasis: '40%' }}>
        <Code>
          <h3>Data:</h3>
          <Rjv hideRoot data={state} />
          <h3>Props:</h3>
          <Rjv hideRoot shouldExpandNode={() => false} data={props} />
        </Code>
      </div>
    </Box>
  )
}

export default DefaultForm