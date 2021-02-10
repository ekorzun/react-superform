import * as React from 'react'
const { Fragment } = React

import { ILayout, IRow } from './types'
import { Row, Col } from './Grid'
import SuperFormField from './Field'


const SuperFormLayout = ({
  layout,
  schema,
  state,
  hide,
  hideStrategy,
  ...other
}: {
  layout: ILayout,
  [key: string]: any
}) => {


  // const isHidden = 

  return (
    <Fragment>
      {layout.map((row: IRow, rowIndex: number) => (
        <Row
          key={rowIndex}
        >
          {row

            .map((col: any, colIndex: any) => (
              <Col
                key={colIndex}
                width={col.width}
              >
                {col.type === 'offset' ? null : (
                  col.type === 'array' ? (
                    // <SuperFormField
                    //   rowIndex={rowIndex}
                    //   colIndex={colIndex}
                    //   field={schema[col.name]}
                    //   layoutField={col}
                    //   state={state}
                    //   schema={schema}
                    //   {...other}
                    // />
                    <Fragment>
                      {JSON.stringify({ col, state })}
                      <SuperFormField
                        rowIndex={rowIndex}
                        colIndex={colIndex}
                        field={schema[col.name]}
                        layoutField={col}
                        state={state}
                        schema={schema}
                        {...other}
                      />
                      {/* {(state[col.name] || []).map((v, index) => (
                      <SuperFormField
                        key={index}
                        index={index}
                        rowIndex={rowIndex}
                        colIndex={colIndex}
                        field={schema[col.name]}
                        layoutField={col}
                        state={state}
                        {...other}
                      />
                    ))} */}
                    </Fragment>
                  ) : (
                      (
                        !hide || (
                          (typeof hide === 'object' && !hide[col.name])
                          || (typeof hide === 'function' && !hide(state, schema, col)[col.name])
                        )
                      ) && (
                        <SuperFormField
                          rowIndex={rowIndex}
                          colIndex={colIndex}
                          schema={schema}
                          field={schema[col.name]}
                          layoutField={col}
                          state={state}
                          hide={hide}
                          {...other}
                        />
                      ) || (null)
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