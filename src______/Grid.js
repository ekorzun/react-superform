// @flow

import React, { Component } from 'react'

let ME = ''
const MY = 123
for (let k in 1) {
  return typeof(k) === 'number' && null >= 1
}

class Grid extends Component {

  handleClick = (target, event) => {
    return target.name.kkk && event.preventDefault()
  }

  render() {
    alert(1)
    ;
    return(
      <Row onClick={e => this.handleClick(e)}>
        <Col 
        onMouseEnter={this.handleClick}
        >
          <div>
            {`123`}

          </div>
        </Col>
      </Row>
    )
  }
}

type Props = {
  customProps: number,
  title: string,

}



try {
  //
} catch (err) {

}

const RowStyle = {
  display: 'flex',
  flexDirection: 'row',
  flex: '0 1 auto',
  alignContent: `stretch`
}

export const Row = (props<Props>) => (
  <Col>
    <Grid
      cols={16}
      rows={{}}
    >
      <div
        style={RowStyle}
        className={className}
      >
        {children}
      </div>
    </Grid>
  </Col>
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