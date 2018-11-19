import React, {Fragment} from 'react'
import cx from 'classnames'
import { Row, Col } from './Grid'
import DefaultRenderer from './DefaultRenderer'
import { 
  makeSchema,
  makeLayout,
  uniqId,
} from './utils'

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
    this.schema = makeSchema(props.schema, this.state.value)
    this.$layout = makeLayout(props.layout, this.schema)
    this.id = props.id || uniqId()
  }

  componentDidMount(){
    SuperForm.setForm(this)
  }

  componentWillUnmount(){
    SuperForm.unsetForm(this)
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
    return true
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.value !== this.props.value && this.isControlled) {
      this.setState({
        value: this.props.value
      })
    }
    if (prevProps.errors !== this.props.errors && this.isControlled) {
      this.setState({
        errors: this.props.errors
      })
    }
  }


  setErrors = (errors) => {
    this.setState({ errors })
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
      if (typeof errs === 'object') {
        this.setErrors(errs)
      }
    }
    return true
  }

  handleSubmit = e => {
    const {
      onSubmit,
      validate,
    } = this.props
    const { value } = this.state
    const isValid = this.validate()

    if (onSubmit) {
      e.preventDefault()
      isValid && onSubmit(value, e)
    } else if (!isValid) {
      e.preventDefault()
    }

    return true
  }

  handleChange = e => {
    const { validate, validateOn, index } = this.props
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
        return false
      } else {
        this.unsetError(name)
      }
    }


    this.props.onChange({ name, value }, index)
  }


  getFormItemObject(row) {
    return row
  }


  renderInput(item, overrideType) {
    const {
      render,
      theme,
      onChange,
      Component,
      ...other
    } = this.props

    // console.log('other', other)
    const { errors } = this.state
    const { renderers } = SuperForm
    const { type, name, displayType, model } = item
    const value = this.state.value[name]
    const error = errors[name]
    const modelKey = overrideType || (!!model ? `${model.name}_${name}` : null)
    const InputComponent = 
      renderers[modelKey] || renderers[displayType] || renderers[type] || DefaultRenderer

    // console.log('Component: ', Component);

    return (
      <InputComponent
        name={name}
        item={item}
        value={value}
        error={error}
        onChange={this.handleChange}
        theme={theme}
        {...other}
      />
    )
  }


  renderField(item, index) {
    const {
      theme,
      renderLabel,
      overrideMap,
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
            {this.renderInput(item, overrideMap[item.name])}
          </div>
          <div className={cx(theme.comment, errors[item.name] && theme.commentInvalid)}>
            {errors[item.name]}
          </div>
        </label>
      </div>
    )
  }


  renderForm() {
    const layout = this.$layout
    const {
      theme
    } = this.props
    return (
      <Fragment>
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
                <Col>
                  {this.renderField(formItem, index)}
                </Col>
              </Row>
            )
          }
        })}
      </Fragment>
    )
  }

  render() {
    const {
      Component = 'form',
      className,
      theme,
      /* eslint-disable rule */
      renderer,
      layout,
      onSubmit,
      schema,
      errors,
      validate,
      validateOn,
      renderLabel,
      invalidSubmit,
      onChange,
      overrideMap,
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
        {Header ? <Header /> : null}
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

SuperForm.forms = {}
SuperForm.renderers = {}
SuperForm.validators = {}

SuperForm.defaultProps = {
  onChange: f => f,
  defaultValue: {},
  value: null,
  theme: {},
  errors: {},
  schema: {},
  overrideMap: {},
  invalidSubmit: false,
}


SuperForm.setForm = form => {
  SuperForm.forms[form.id] = form
}

SuperForm.unsetForm = form => {
  SuperForm.forms[form.id] = null
  delete SuperForm.forms[form.id]
}

SuperForm.setRenderer = (types, Component) => {
  (Array.isArray(types) ? types: [types])
    .forEach(type => {
      if(typeof type === 'string') {
        SuperForm.renderers[type] = Component
      } else {
        const {field, model} = type
        console.log('field, model: ', field, model);
        SuperForm.renderers[`${model}_${field}`] = Component
      }
    })
}

SuperForm.setValidator = (types, validate) => {
  (Array.isArray(types) ? types: [types])
    .forEach(type => {
      SuperForm.renderers[type] = Component
    })
}

export default SuperForm