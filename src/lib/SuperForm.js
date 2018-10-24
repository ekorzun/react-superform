import React from 'react'
import cx from 'classnames'
import { Row, Col } from './Grid'

class SuperForm extends React.Component {

  static renderers = {}
  static validators = {}

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

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (this.state !== nextState) {
      return true
    }
    if (this.isControlled) {
      if (this.props.value !== nextProps.value) {
        return true
      }
      if (this.props.defaultValue !== nextProps.defaultValue) {
        return false
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.value !== this.props.value && this.isControlled) {
      this.setState({
        value: this.props.value
      })
    }
  }


  setErrors = (errors) => {
    this.setState({errors})
  }

  setError = (key, value) => {
    this.setState({
      errors: {
        ...this.state.errors,
        [key]: value
      }
    })
  }

  unsetError = (key) => {
    this.setState({
      errors: {
        ...this.state.errors,
        [key]: null,
      }
    })
  }

  validate = () => {
    const { validate } = this.props
    if (!validate) {
      return true
    }
    const errs = validate(this.state.value)
    if (errs) {
      if(typeof errs === 'object') {
        this.setErrors(errs)
      }
    }
    return true
  }

  handleSubmit(e) {
    const {
      onSubmit,
      validate,
    } = this.props
    const { value } = this.state
    const isValid = this.validate()

    if (onSubmit) {
      e.preventDefault()
      isValid && onSubmit(e, value)
    } else if (!isValid) {
      e.preventDefault()
    }

    return true
  }

  handleChange(e) {
    const { validate, validateOn } = this.props
    const { name, value } = e.target
    this.setState({
      value: {
        ...this.state.value,
        [name]: value,
      }
    })
    if (validateOn === 'change' && validate) {
      const err = validate({ [name]: value })
      if (err) {
        this.setError(name, err)
      } else {
        this.unsetError(name)
      }
    }
    this.props.onChange({ name, value })
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
    if (layout) {
      const cvalue = value || defaultValue
      const convert = field => {
        if (typeof field === 'string') {
          return schema[field] ? {
            name: field,
            ...schema[field],
          } : {
              name: field,
              label: field,
              type: typeof (cvalue[field] || {}).value,
            }
        }
      }
      return (this.$layout = layout.map(field => {
        if (Array.isArray(field)) {
          return field.map(f => convert(f))
        } else {
          return convert(field)
        }
      }))
    }
    if (model) {
      return (this.$layout = model.getAttributes())
    }
    if (schema) {
      return (this.$layout = (Array.isArray(schema)
        ? schema
        : Object.keys(schema)
      ))
    }
    if (value || defaultValue) {
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
      theme,
    } = this.props
    const { errors } = this.state
    const { renderers } = SuperForm
    const { type } = item

    if (renderers[type]) {
      const Component = renderers[type]
      return <Component {...this.props} />
    }

    return (
      <input
        name={item.name}
        onChange={this.handleChange}
        value={this.state.value[item.name]}
        className={cx(theme.input, errors[item.name] && theme.inputInvalid)}
        {...item}
        style={{
          display: 'block',
          width: '100%'
        }}
      />

    )
  }


  renderField(item, index) {
    const {
      theme,
      renderLabel,
    } = this.props
    const { errors, value } = this.state

    return (
      <div
        key={`sf-row-${index}`}
      >
        <label>
          <div
            className={cx(theme.label, errors[item.name] && theme.labelInvalid)}
          >
            {renderLabel ? (
              renderLabel(item, value[item.name])
            ) : (
                item.label || item.name
              )}:
            {item.required ? (
              <span style={{
                color: 'red',
                fontWeight: 'bold'
              }}>*</span>
            ) : (null)}
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
    const {
      theme
    } = this.props
    return (
      <React.Fragment>
        {layout.map((row, index) => {
          if (Array.isArray(row)) {
            return (
              <Row key={`sf-row-${index}`} className={cx(theme.row)}>
                {row.map((cell, cindex) => {
                  const formItem = this.getFormItemObject(cell)
                  return (
                    <Col key={`sf-col-${cindex}`} className={theme.col}>
                      {this.renderField(formItem, index)}
                    </Col>
                  )
                })}
              </Row>
            )
          } else {
            const formItem = this.getFormItemObject(row)
            return (
              <Row key={`sf-row-${index}`} className={cx(theme.row)}>
                {this.renderField(formItem, index)}
              </Row>
            )
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
      schema,
      errors,
      validate,
      validateOn,
      renderLabel,
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
        ) : (null)}
      </Component>
    )
  }
}


SuperForm.defaultProps = {
  onChange: f => f,
  renderer: require('./renderer').default,
  defaultValue: {},
  value: null,
  theme: {},
  errors: {},
  schema: {},
}


SuperForm.setRenderer = (type, render) => {
  SuperForm.renderers[type] = 123
}

SuperForm.setValidator = (type, render) => {
  SuperForm.validators[type] = 123
}

export default SuperForm