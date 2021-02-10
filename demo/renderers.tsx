import * as React from 'react'
import { Select, MenuItem } from '@material-ui/core'
import { setRenderer } from '../src'

setRenderer(`select`, ({
  field,
  name,
  onChange
}) => {
  return (
    <Select
      fullWidth
      name={name}
      onChange={onChange}
    >
      {field.options.map(opt => (
        <MenuItem
          key={opt.value}
          value={opt.value}
        >
          {opt.label}
        </MenuItem>
      ))}
    </Select>
  )
})

setRenderer(`password`, p => <input {...p} type='password' />)