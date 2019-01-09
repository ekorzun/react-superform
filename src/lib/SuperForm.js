import React, { Fragment } from 'react'
import cx from 'classnames'
import { Row, Col } from './Grid'
import DefaultRenderer from './DefaultRenderer'
import {
  makeSchema,
  makeLayout,
  uniqId,
} from './utils'

const pick = (obj, ...keys) => keys.reduce((acc, key) => (
  acc[key] = obj[key], acc
), {})

const getInputProps = props => pick(props, '')
const getContainerProps = props => pick(props, '')
// const getInputProps = props => pick(props, '')
// const getInputProps = props => pick(props, '')

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

  componentDidMount() {
    SuperForm.setForm(this)
  }

  componentWillUnmount() {
    SuperForm.unsetForm(this)
    clearTimeout(this.dropErrorsTimer)
    clearTimeout(this.validateTimer)
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
    if ((prevProps.value !== this.props.value) && this.isControlled) {
      this.setState({
        value: this.props.value
      })
    }
    if ((prevProps.errors !== this.props.errors) && this.isControlled) {
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
      clearTimeout(this.validateTimer)
      this.validateTimer = setTimeout(_ => {
        const err = validate({
          [name]: value,
        })

        if (err) {
          if (typeof err === 'string') {
            this.setError(name, err)
          } else if (typeof err === 'object') {
            this.setErrors(err)
          }
          return false
        } else {
          this.unsetError(name)
        }
      }, 333)
    }

    this.props.onChange({ name, value }, index, this.state)
  }

  handleFocus = e => {
    clearTimeout(this.dropErrorsTimer)
    clearTimeout(this.validateTimer)
    this.dropErrorsTimer = setTimeout(_ => {
      this.setErrors({})
    })
    this.props.onFocus
      && this.props.onFocus(e)
  }


  getFormItemObject(row) {
    return row
  }


  renderInput(item, overrideType) {
    const {
      render,
      theme,
      onChange,
      onFocus,
      Component,
      overrideMap,
      isHidden,
      isDisabled,
      ...other
    } = this.props

    // console.log('other', other)
    const { errors } = this.state
    const { renderers } = SuperForm
    const { type, name, displayType, model } = item
    const value = this.state.value[name]
    const error = errors[name]
    const modelKey = overrideType || (!!model ? `${model.name}_${name}` : null)

    if (typeof overrideType === 'function') {
      return overrideType({
        value,
        error,
        item,
        name,
        onChange,
        onFocus,
        disabled: isDisabled && isDisabled[name],
        index: this.props.index
      }, this.state )
    }

    const InputComponent =
      renderers[modelKey] // overriden type or Model_KEY
      || renderers[displayType] // field can have displayType from schema
      || renderers[type] // global renderer type
      || DefaultRenderer // default fallback

    // console.log('Component: ', Component);

    return (
      <InputComponent
        {...other}
        disabled={isDisabled && isDisabled[name]}
        name={name}
        item={item}
        value={value}
        error={error}
        onChange={this.handleChange}
        onFocus={this.handleFocus}
        setError={this.setError}
        unsetError={this.unsetError}
        theme={theme}
      />
    )
  }


  renderField(item, index, name) {
    const {
      theme,
      renderLabel,
      overrideMap,
      noLabels,
      noErrors,
      isDisabled,
    } = this.props
    const { errors, value } = this.state

    if (!item) {
      item = { name, type: name, fake: true }
    }

    return (
      <div
        key={`sf-row-${index}`}
      >
        <label>
          <div
            className={cx(
              theme.label, 
              errors[item.name] && theme.labelInvalid,
              isDisabled && isDisabled[item.name] && theme.labelDisabled
            )}
          >
            {noLabels ? null : (!item.fake && (
              (renderLabel ? (
                renderLabel(item, value[item.name], this.state)
              ) : (
                  (item.label || item.name) + ':'
                ))
            ))}

            {noLabels ? null : ((!item.fake && item.required) ? (
              <span style={{
                color: 'red',
                fontWeight: 'bold'
              }}>*</span>
            ) : (null))}
          </div>
          <div className={cx(theme.input, errors[item.name] && theme.inputInvalid)}>
            {this.renderInput(item, overrideMap[item.name], index)}
          </div>
          {noErrors ? (null): (
            <div className={cx(theme.comment, errors[item.name] && theme.commentInvalid)}>
              {errors[item.name]}
            </div>
          )}
        </label>
      </div>
    )
  }


  renderRow(cells, index){
    const {RowComponent, rowProps, theme, isHidden} = this.props
    const ComputedRow = RowComponent || Row
    const props = typeof rowProps === 'function' 
      ? rowProps(cells, this.state, index)
      : (rowProps || {})

    if (cells.length === 1 && isHidden && isHidden[cells[0].name]) {
      return null
    }

    return (
      <ComputedRow 
        className={cx(props.className, theme.row)} 
        key={`sf-row-${index}`}
        {...props}
      >
        {cells.map((cell, cindex) => {
          const formItem = this.getFormItemObject(cell)
          return this.renderCol(formItem, cindex, cell)
        })}
      </ComputedRow>
    )    
  }

  renderCol(field, index, cell){
    // console.log('cell: ', cell);
    const {ColComponent, colProps, theme, isHidden} = this.props
    const ComputedCol = ColComponent || Col
    const props = typeof colProps === 'function' 
      ? colProps(field, this.state)
      : (colProps || {})
    if (isHidden && (isHidden[cell] || isHidden[field.name])) {
      return null
    }
    return (
      <ComputedCol 
        className={cx(props.className, theme.col)} 
        key={`sf-col-${index}`}
        width={cell.width}
        {...props}
      >
        {this.renderField(field, index, cell)}
      </ComputedCol>
    )
  }


  renderForm() {
    const layout = this.$layout
    return (
      <Fragment>
        {layout.map((row, index) =>
          this.renderRow(Array.isArray(row) ? row : [row], index)
        )}
      </Fragment>
    )
  }

  render() {
    const {
      Component,
      className,
      theme,
      /* eslint-disable rule */
      overrideRenderField,
      RowComponent,
      rowProps,
      ColComponent,
      colProps,
      renderer,
      layout,
      onSubmit,
      schema,
      errors,
      validate,
      validateOn,
      renderLabel,
      onChange,
      overrideMap,
      isHidden,
      isDisabled,
      noLabels,
      noErrors,
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

const noop = f => {}

SuperForm.forms = {}
SuperForm.renderers = {}
SuperForm.validators = {}

SuperForm.defaultProps = {
  // Main container tag
  Component: 'form',
  RowComponent: null,
  ColComponent: null,

  rowProps: null,
  colProps: null,
  renderLabel: null,

  // Callbacks
  onChange: noop,
  onFocus: noop,
  validate: null,

  // UX
  validateOn: 'change', // submit

  // Values
  defaultValue: {}, // uncontrolled default value
  value: null, // controlled value
  errors: {}, // controller errors
  schema: {}, // object schema
  layout: null, // form layout
  isHidden: null,
  isDisabled: null,

  overrideMap: {}, // @todo -> overrideType
  overrideRenderField: {}, // complete new renderer including label/comment/parent container

  // Themes
  noLabels: false,
  noErrors: false,
  theme: {
    label: '',
    labelInvalid: '',
    labelDisabled: '',
    input: '',
    inputInvalid: '',
    inputDisabled: '',
    comment: '',
    commentInvalid: '',
    commentDisabled: '',
    col: '',
    row: '',
    body: '',
    footer: '',
    container: '',
  },
}


SuperForm.setForm = form => {
  SuperForm.forms[form.id] = form
}

SuperForm.unsetForm = form => {
  SuperForm.forms[form.id] = null
  delete SuperForm.forms[form.id]
}

SuperForm.setRenderer = (types, Component) => {
  (Array.isArray(types) ? types : [types])
    .forEach(type => {
      if (typeof type === 'string') {
        SuperForm.renderers[type] = Component
      } else {
        const { field, model } = type
        // console.log('field, model: ', field, model);
        SuperForm.renderers[`${model}_${field}`] = Component
      }
    })
}

SuperForm.setValidator = (types, validate) => {
  (Array.isArray(types) ? types : [types])
    .forEach(type => {
      SuperForm.renderers[type] = Component
    })
}

export default SuperForm