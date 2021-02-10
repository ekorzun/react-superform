export type ILayout = IRow[]

export type IRow = ICol[]

export type ICol = {
  field: IField
  width?: number
  type?: string
  name?: string
}

export type IField = {
  type: string
  name: string
  label?: string | Function
  of?: string
  noLabel?: boolean
}

export type IFieldRender = {
  theme?: ITheme
}

export type IFieldEvents = {
  onChange: Function
  onFocus?: Function
  onBlur?: Function
}

export type ITheme = {
  container?: string
  row?: string
  col?: string
  field?: string
  fieldInvalid?: string
  fieldDisabled?: string
  label?: string
  labelInvalid?: string
  labelDisabled?: string
  input?: string
  inputInvalid?: string
  inputDisabled?: string
  hint?: string
}

export type IAny = {
  [key: string]: any
}