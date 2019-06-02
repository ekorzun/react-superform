import {
  ProfModel
}  from './index.setup'


export const CREDIT_CARD_SCHEMA = {
  name: {
    validate: 'required',
  },
  number: {
    validate: 'required|digits',
  },
  date: {
    validate: 'required',
  },
  cvc: {
    validate: 'required',
  }
}

export const ADDRESS_SCHEMA = {
  city: {
    validate: 'required',
  },
  zipcode: {
    validate: 'required|digits',
  },
  street: {
    validate: 'required',
  },
}


export default {
  tags: {
    type: 'array',
  },
  
  name: {
    label: 'Имя',
    validate: 'required|string|min:3'
  },

  fname: {
    label: 'Фамилия',
    validate: 'required|min:3'
  },

  mname: {
    label: 'Отчество',
    validate: 'nullable|max:10',
  },

  gender: {
    type: 'select',
    label: 'Пол',
    options: [{label: 'Женский', value: 'female'}, {label: 'Мужской', value: 'male'}],
    validate: 'required'
  },

  prof: {
    label: 'Профессия',
    type: 'select',
    options: () => ProfModel.getConnector().list().data,
    labelKey: 'name',
    valueKey: 'id'
  },

  phone: {
    label: 'Телефон',
    type: 'phone',
    validate: 'nullable',
    mergeErrors: ['phone_code', 'phone_number'],
  },

  phone_code: {
    validate: 'required|digits|min:2|max:4'
  },
  
  phone_number: {
    validate: 'required|digits|min:6|max:8'
  },

  card: {
    label: 'Кредитная карта',
    type: 'creditcard',
    validate: Object.keys(CREDIT_CARD_SCHEMA)
      .filter(f => CREDIT_CARD_SCHEMA[f].validate)
      .reduce((acc, field) => {
        acc[`${field}`] = CREDIT_CARD_SCHEMA[field].validate
        return acc
      }, {})
  },

  address: {
    label: 'Адрес',
    type: 'address',
    validate: Object.keys(ADDRESS_SCHEMA)
      .filter(f => ADDRESS_SCHEMA[f].validate)
      .reduce((acc, field) => {
        acc[`${field}`] = ADDRESS_SCHEMA[field].validate
        return acc
      }, {})
  },
  
  billing_address: {
    label: 'Биллинг адрес',
    type: 'address'
  },

  sum: {
    label: 'Итого'
  },
}