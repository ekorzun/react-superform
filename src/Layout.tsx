import * as React from 'react'
const { Fragment } = React

import { ILayout, IRow } from './types'
import { Row, Col } from './Grid'
import SuperFormField from './Field'


const SuperFormLayout = ({
  layout,
  schema,
  state,
  ...other
}: {
  layout: ILayout
}) => {
  return (
    <Fragment>
      {layout.map((row: IRow, rowIndex: number) => (
        <Row
          key={rowIndex}
        >
          {row

            .map((col, colIndex) => (
            <Col
              key={colIndex}
              width={col.width}
            >
              {col.type === 'offset' ? null : (
                col.type === 'array' ? (
                  <SuperFormField
                    rowIndex={rowIndex}
                    colIndex={colIndex}
                    field={schema[col.name]}
                    layoutField={col}
                    state={state}
                    schema={schema}
                    {...other}
                  />
                  // <Fragment>
                  //   {JSON.stringify(col)}
                  //   {state[col.name].map((v, index) => (
                  //     <SuperFormField
                  //       key={index}
                  //       index={index}
                  //       rowIndex={rowIndex}
                  //       colIndex={colIndex}
                  //       field={schema[col.of]}
                  //       layoutField={col}
                  //       state={state}
                  //       {...other}
                  //     />
                  //   ))}
                  // </Fragment>
                ) : (
                    (
                      <SuperFormField
                        rowIndex={rowIndex}
                        colIndex={colIndex}
                        field={schema[col.name]}
                        layoutField={col}
                        state={state}
                        {...other}
                      />
                    )
                  )
              )}
            </Col>
          ))}
        </Row>
      ))}
    </Fragment>
  )
}

export default SuperFormLayout