import React from 'react'
import cx from 'classnames'
import {Row, Col} from './Grid'

class SuperForm extends React.Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      errors: props.errors || {},
      value: {
        ...props.defaultValue,
        ...props.value,
      }
    }

    this.isControlled = (props.value !== undefined) ? true : false
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.value !== this.props.value && this.isControlled) {
      this.setState({
        value: this.props.value
      })
    }
  }


  handleSubmit(e){
    if (this.props.onSubmit) {
      e.preventDefault()
      this.props.onSubmit(e, this.state)
    }
  }

  handleChange(e){
    const value = {
      ...this.state.value,
      [e.target.name]: e.target.value,
    }
    this.setState({value})
  }

  createLayout() {
    if (this.$layout) { return this.$layout }
    const {
      model,
      schema,
      defaultValue,
      value,
      layout,
    } = this.props
    if(layout) {
      const cvalue = value || defaultValue
      const convert = field => {
        if(typeof field === 'string') {
          return schema[field] || {
            name: field,
            label: field,
            type: typeof (cvalue[field] || {}).value,
          }
        }
      }
      return (this.$layout = layout.map(field => {
        if(Array.isArray(field)) {
          return field.map(f => convert(f))
        } else {
          return convert(field)
        }
      }))
    }
    if (model) { return (this.$layout = model.getAttributes()) }
    if(schema) {
      return (this.$layout = (Array.isArray(schema)
        ? schema
        : Object.keys(schema)
      ))
    }
    if(value || defaultValue) {
      const cvalue = value || defaultValue
      return Object
        .keys(cvalue)
        .map(key => ({
          name: key,
          value: cvalue[key],
          type: typeof cvalue[key],
        }))
    }

    throw new Error('Unable to create form schema')
  }

  getFormItemObject(row) {
    return row
  }


  renderInput(item) {
    
    const {
      model,
      render,
      renderers,
      errors,
      theme,
    } = this.props
    const { type } = item
    if (renderers[type]) {
      const Component = renderers[type]
      return <Component {...this.props} />
    }

    return (
      <div>
        <input
          name={item.name}
          onChange={this.handleChange}
          value={this.state.value[item.name]}
          className={cx(theme.input, errors[item.name] && theme.inputInvalid)}
        />
      </div>
    )
  }


  renderField(item, index) {
    const {
      theme,
      errors,
    } = this.props
    return (
      <div
        className={cx(theme.row)}
        key={`sf-row-${index}`}
      >
        <label>
          <div
            className={cx(theme.label, errors[item.name] && theme.labelInvalid)}
          >
            {item.label || item.name}
          </div>
          <div className={cx(theme.input, errors[item.name] && theme.inputInvalid)}>
            {this.renderInput(item)}
          </div>
        </label>
      </div>
    )
  }


  renderForm() {
    const layout = this.createLayout()
    return (
      <React.Fragment>
        {layout.map((row, index) => {
          if (Array.isArray(row)) {
            return (
              <Row key={`sf-row-${index}`}>
                {row.map((cell, cindex) => {
                  const formItem = this.getFormItemObject(cell)
                  return (
                    <Col key={`sf-col-${cindex}`}>
                      {this.renderField(formItem, index)}
                    </Col>
                  )
                })}
              </Row>
            )
          } else {
            const formItem = this.getFormItemObject(row)
            return this.renderField(formItem, index)
          }
        })}
      </React.Fragment>
    )
  }

  render() {
    const {
      Component = 'form',
      className,
      theme,
      /* eslint-disable rule */
      model,
      renderer,
      layout,
      onSubmit,
      /* eslint-enable rule */
      Header,
      children,
      ...other
    } = this.props

    return (
      <Component
        onSubmit={this.handleSubmit}
        className={cx(theme.container, className)}
        {...other}
      >
        {Header ? <Header {...this.props} /> : null}
        <div className={cx(theme.body)}>
          {this.renderForm()}
        </div>
        {children ? (
          <div className={cx(theme.footer)}>
            {children}
          </div>
        ):(null)}
      </Component>
    )
  }
}


SuperForm.defaultProps = {
  renderer: require('./renderer').default,
  renderers: {},
  defaultValue: {},
  value: null,
  theme: {},
  errors: {},
  schema: {},
}

export default SuperForm