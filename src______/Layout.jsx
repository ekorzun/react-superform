import React from 'react'

const SuperFormLayout = props => {
  return (
    <Fragment>
      {layout.map((row, rowIndex) => (
        <Row
          key={rowIndex}
        >
          {row.map((col, colIndex) => (
            <Col key={colIndex}>
            </Col>
          ))}
        </Row>
      ))}
    </Fragment>
  )
}

export default SuperFormLayout