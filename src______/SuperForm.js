
import React, { Component,  Fragment,useMemo, useState, useCallback} from 'react'
import cx from 'classnames'

import { Row, Col } from './Grid'
import * as validator from './validator'

import {
  makeSchema,
  makeLayout,
  uniqId,
  noop,
  nearest
} from './utils'

const cm = {}
const renderers = {}

const useSchema = (state, layout, schema) => {
  return useMemo(() => {
    console.log('useSchema: ');
    return schema
  }, [schema])
}

const useLayout = (state, layout, schema) => {
  return useMemo(() => {
    return makeLayout(layout, schema)
  }, [schema])
}


const SuperFormInput = ({
  field,
  value,
  name,
  override,
  overrideDisplayType,
  overrideType,
  overrideRenderField,
}, ...props) => {
  const {type, displayType} = field
  const InputComponent =
    renderers[overrideDisplayType[displayType]] //
    || renderers[overrideType[type]] //
    || renderers[displayType] // field can have displayType from schema
    || renderers[type] // global renderer type
    || 'input' // default fallback

  return (
    <InputComponent 
      {...props}
      value={value}
      name={name}
      field={field}
    />
  )
}

const SuperFormField = (props) => {

  const {
    field,
    theme,
    errors = {},
    disabled,
    value,
    warnings,
    noLabels,
    noHints,
    renderLabel,
    override,
    overrideDisplayType,
    overrideType,
    overrideRenderField,
    colIndex,
    rowIndex,
    ...other
  } = props
  
  const error = typeof errors === 'string'
    ? errors === field.name
      ? true
      : false
    : Array.isArray(errors)
      ? errors.indexOf(field.name) > -1
      : errors[field.name]
  const hasError = !!error
  const isDisabled = disabled
  const isHidden = false

  return (

      <label 
        className={cx(
          cm.field, 
          theme.field,
          hasError && theme.fieldInvalid,
          isDisabled && theme.fieldDisabled
        )}
      >
        <div
          className={cx(
            cm.label,
            theme.label,
            hasError && theme.labelInvalid,
            isDisabled && theme.labelDisabled
          )}
        >
          
          {field.label}

          {/* {(noLabels || item.label === null) ? null : (!item.fake && (
            (renderLabel ? (
              renderLabel(item, value[item.name], this.state)
            ) : (
                (item.label || item.name) + ':'
              ))
          ))} */}

          {/* {noLabels ? null : ((!item.fake && item.required) ? (
            <span style={{
              color: 'red',
              fontWeight: 'bold'
            }}>*</span>
          ) : (null))} */}
        </div>

        <div 
          className={cx(
            theme.input, 
            hasError && theme.inputInvalid
          )}
        >
          <If condition={!isHidden}>
            <SuperFormInput 
              hasError={hasError}
              isDisabled={isDisabled}
              overrideDisplayType={overrideDisplayType}
              overrideType={overrideType}
              overrideRenderField={overrideRenderField}
              field={field}
              error={error}
              value={value}
              name={name}
              onChange={e => e}
            />
          </If>
        </div>
        {/* {noHints ? (null) : (
          <div className={cx(theme.hint, errors[item.name] && theme.commentInvalid)}>
            {
              Array.isArray(errors[item.name]) || typeof errors[item.name] === 'string'
                ? errors[item.name]
                : null
            }
          </div>
        )} */}
      </label>
  )
}


const SuperFormBase = ({
  // layout,
  // schema,
  defaultValue,
  value,
  hidden,
  id = uniqId(),
  children,
  theme = {},

  // global props
  disabled,
  invalid,
  valid,
  loading,
  warning,
  errors,

  // Data structure

  // Dataflow
  validateOn,

  // Extra Components
  Footer,
  Header,
  Actions,

  // renderers
  renderLabel,

  // Callbacks
  onValidate,
  onError,
  onFocus = noop,
  onBlur = noop,
  onChange = noop,
  onSubmit = noop,

  ...other
}) => {
  const isControlled = value !== undefined
  const [state, setState] = useState({ ...value, ...defaultValue })
  const [_errors, setErrors] = useState(errors)

  const schema = useSchema(state, other.layout, other.schema)
  console.log('schema: ', schema);
  const layout = useLayout(state, other.layout, other.schema)
  console.log('layout: ', layout);

  const handleChange = useCallback(() => {
    onChange(state)
  }, [state])

  const handlers = useMemo(() => ({
    onChange: handleChange,
  }), [])

  return (
    <div>
      <Fragment>
        {layout.map((row, rowIndex) => (
          <Row
            key={rowIndex}
          >
            {(Array.isArray(row) ? row : [row]).map((col, colIndex) => (
              <Col key={colIndex}>
                <SuperFormField
                  {...handlers}
                  theme={theme}
                  disabled={disabled}
                  hidden={hidden}
                  loading={loading}
                  warning={warning}
                  invalid={invalid}
                  valid={valid}
                  name={col.name}
                  value={state[col.name]}
                  state={state}
                  rowIndex={rowIndex}
                  colIndex={colIndex}
                  col={col}
                  field={schema[col.name]}
                  {...other}
                />
              </Col>
            ))}
          </Row>
        ))}
      </Fragment>

    </div>
  )
}

class SuperForm extends Component {
  render(){
    return <SuperFormBase {...this.props} />
  }
}



const pick = (obj, ...keys) => keys.reduce((acc, key) => (
  acc[key] = obj[key], acc
), {})

const getInputProps = props => pick(props, '')
const getContainerProps = props => pick(props, '')
// const getInputProps = props => pick(props, '')
// const getInputProps = props => pick(props, '')


class SuperForm222 extends React.Component {

  isSuperForm = true

  constructor(props, context) {
    super(props, context)
    this.state = {
      windowWidth: window.innerWidth,
      errors: props.errors || {},
      value: {
        ...props.defaultValue,
        ...props.value,
      }
    }
    this._isControlled = (props.value !== undefined) ? true : false
    this.schema = makeSchema(props.schema, this.state.value)
    this.id = props.id || uniqId()

    this._isResponsive = !!props.layout && !Array.isArray(props.layout)
    

    if (!this._isResponsive) {
      this.$layouts = {
        default: makeLayout(props.layout, this.schema)
      }
    } else {
      if(props.layout) {
        const breakpoints = Object.keys(props.layout)
        this.$breakpoints = breakpoints.map(x => ~~x)
        this.$layouts = breakpoints.reduce((acc, breakpoint, index) => {
          // console.log('breakpoint: ', breakpoint, props.layout[breakpoint]);
          if (index === 0) {
            acc.default = makeLayout(props.layout[breakpoint], this.schema)
          }
          acc[breakpoint] = makeLayout(props.layout[breakpoint], this.schema)
          return acc
        }, {})
      } else {
        this.$breakpoints = [0]
        this.$layouts = {
          default: makeLayout(null, this.schema)
        }
      }
    }

    // console.log("this.scherma", this.schema)
  }

  componentDidMount() {
    this._resizeInit()
    SuperForm.setForm(this)
    const {onMount} = this.props
    const {value} = this.state
    onMount(value)
  }

  componentWillUnmount() {
    this._resizeDestroy()
    SuperForm.unsetForm(this)
    clearTimeout(this.dropErrorsTimer)
    clearTimeout(this.validateTimer)
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (this.state !== nextState) {
      return true
    }
    if (this._isControlled) {
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
    if ((prevProps.value !== this.props.value) && this._isControlled) {
      this.setState({
        value: this.props.value
      })
    }
    if ((prevProps.errors !== this.props.errors) && this._isControlled) {
      this.setState({
        errors: this.props.errors
      })
    }
  }


  getLayout = () => {
    if (!this._isResponsive) {
      return this.$layouts.default 
    }
    const { windowWidth } = this.state
    const near = nearest(this.$breakpoints, windowWidth)
    return this.$layouts[this.$breakpoints[near]]
  }

  _resizeInit = () => {
    if (window === undefined) {
      return
    }
    window.addEventListener('resize', this.handleResize)
  }

  _resizeDestroy = () => {
    if (window === undefined) {
      return
    }
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize = () => {
    this.setState({
      windowWidth: window.innerWidth
    })
    // console.log('this.$windowWidth: ', this.state.windowWidth);
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

  _getFormData = () => {
    const {schema} = this
    const {value} = this.state
    return Object.keys(schema)
      .filter(fieldname => schema[fieldname].validate)
      .reduce((acc, fieldname) => {
        // console.log("schema[fieldname].mergeErrors", schema[fieldname])
        acc[fieldname] = {
          value: value[fieldname] || '',
          validation: schema[fieldname].validate,
          mergeErrors: schema[fieldname].mergeErrors,
        }
        return acc
      }, {})
  }

  validate = () => {
    const { onError } = this.props
    // if (!validate) {
    //   return true
    // }
    const formData = this._getFormData()
    // console.log('formData: ', JSON.stringify(formData));
    if (formData) {
      const validationResult = validator.validateForm(formData)
      console.log('validationResult: ', validationResult);

      if (validationResult.errors) {
        const { errors } = validationResult
        
        Object
          .keys(formData)
          .filter(name => formData[name].mergeErrors)
          .forEach(name => {
            formData[name].mergeErrors
              .filter(name2 => errors[name2])
              .forEach(name2 => {
                errors[name] = (errors[name] || []).concat(errors[name2])
              })
          })

        this.setErrors(errors)
        return false
      }
    }
    return true
  }

  handleSubmit = e => {
    const {
      onSubmit,
      validateOn
    } = this.props

    if (validateOn === 'submit') {
      const { value } = this.state
      const isValid = this.validate()

      if(!isValid) {
        e.stopPropagation()
        e.preventDefault()
        return false
      }

      onSubmit(value, e)

    }

    return true
  }

  handleChange = e => {
    const { validate, validateOn, index } = this.props
    const { name, value } = e.target
    
    const newStateValue = {
      ...this.state.value,
      [name]: value,
    }

    this.setState({value: newStateValue})

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

    this.props.onChange(e, { name, value }, {
      ...this.state,
      value: newStateValue
    }, index)
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
      override,
      isHidden,
      isDisabled,
      onMount,
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
      }, this.state)
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
        errors={errors}
        namedErrors={errors[name]}
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
      override,
      noLabels,
      noHints,
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
            {(noLabels || item.label === null) ? null : (!item.fake && (
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
            {this.renderInput(item, override[item.name], index)}
          </div>
          {noHints ? (null) : (
            <div className={cx(theme.hint, errors[item.name] && theme.commentInvalid)}>
              {
                Array.isArray(errors[item.name]) || typeof errors[item.name] === 'string'
                  ? errors[item.name]
                  : null
              }
            </div>
          )}
        </label>
      </div>
    )
  }


  renderRow(cells, index) {
    const { RowComponent, rowProps, theme, isHidden } = this.props
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

  renderCol(field, index, cell) {
    // console.log('cell: ', cell);
    const { ColComponent, colProps, theme, isHidden } = this.props
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
    const layout = this.getLayout()
    // console.log('layout: ', layout);
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
      override,
      isHidden,
      isDisabled,
      noLabels,
      noHints,
      onMount,
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
        {/* {JSON.stringify(this.state.value)} */}
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
  // Main container tag
  Component: 'form',
  RowComponent: null,
  ColComponent: null,

  rowProps: null,
  colProps: null,
  renderLabel: null,

  // Callbacks
  onMount: noop,
  onSubmit: noop,
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

  override: {}, // @todo -> overrideType
  overrideRenderField: {}, // complete new renderer including label/hint/parent container
  overrideDisplayType: {},
  overrideType: {},

  // Themes
  noLabels: false,
  noHints: false,
  theme: {
    label: '',
    labelInvalid: '',
    labelDisabled: '',
    input: '',
    inputInvalid: '',
    inputDisabled: '',
    hint: '',
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