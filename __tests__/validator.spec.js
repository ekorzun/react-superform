import {validateForm, validateField} from "../src/validator"



test('Validator: string', () => {

  expect(validateForm({
    foo: {
      value: '',
      validation: 'required'
    },
  }, false)).toEqual({
    errors: {foo: ['required']}
  })

  expect(validateForm({
    foo: {
      value: 'a',
      validation: 'required|min:3'
    },
  }, false)).toEqual({
    errors: {foo: ['min']}
  })

  expect(validateForm({
    foo: {
      value: 'aasdasd',
      validation: 'required|max:3'
    },
  }, false)).toEqual({
    errors: {foo: ['max']}
  })

  expect(validateForm({
    foo: {
      value: '',
      validation: 'required|min:2|max:4'
    },
  }, false)).toEqual({
    errors: {foo: ['required', 'min', 'max']}
  })

  expect(validateForm({
    foo: {
      value: 'bar',
      validation: 'required|min:2|max:4'
    },
  }, false)).toEqual({
    errors: false
  })

  expect(validateForm({
    foo: {
      value: 'bar',
      validation: 'email'
    },
  }, false)).toEqual({
    errors: {foo: ['email']}
  })

  expect(validateForm({
    foo: {
      value: 'e.korzun@gmail.com',
      validation: 'email'
    },
  }, false)).toEqual({
    errors: false
  })

  
})
