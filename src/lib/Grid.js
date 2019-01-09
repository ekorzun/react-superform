import React from 'react'

const RowStyle = {
  display: 'flex',
  flexDirection: 'row',
  flex: '0 1 auto',
  alignContent: 'stretch'
}

export const Row = ({ children, className }) => (
  <div style={RowStyle} className={className}>
    {children}
  </div>
)

export const Col = ({ children, className, width }) => {
  return (
    <div 
      style={{
        flex: width ? `0 0 ${100 * width / 12}%` : '1'
      }} 
      className={className}
    >
      {children}
    </div>
  )
}