import { makeSchema } from "../src/utils"



test('Schema: from value', () => {

  const m = s => makeSchema(null,s)

  // Empty schema, empty object value
  expect(m({})).toEqual({})
  
  // 
  expect(m({
    foo: ''
  })).toEqual({
    foo: { name: 'foo', type: 'string', defaultValue: '' }}
  )

  // 
  expect(m({
    foo: 1
  })).toEqual({ foo: { name: 'foo', type: 'number', defaultValue: 1 }})
  
  // 
  expect(m({
    foo: false
  })).toEqual({ foo: { name: 'foo', type: 'boolean', defaultValue: false }})

  // 
  expect(m({
    user: {
      name: '',
      age: 18
    }
  })).toStrictEqual({
    user: {
      name: 'user',
      type: 'object',
      age: 18,
      name: ''
    }
  })
})


test('Schema: from defined schema', () => {
  expect(makeSchema({})).toEqual({})
  
  expect(makeSchema({
    foo: {
      type: 'string'
    }
  }, {
    foo: 'xxx'
  })).toEqual({ foo: { name: 'foo', type: 'string', defaultValue: 'xxx' }})

})
