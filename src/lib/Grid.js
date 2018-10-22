import React from 'react'

const RowStyle = {
  display: 'flex',
  flexDirection: 'row',
  flex: '0 1 auto'
}

const ColStyle = {
  flex: '0 0 auto'
}

export const Row = ({children, className}) => (
  <div style={RowStyle} className={className}>
    {children}
  </div>
)

export const Col = ({ children, className}) => (
  <div style={ColStyle} className={className}>
    {children}
  </div>
)