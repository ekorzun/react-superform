import { makeLayout } from "../src/utils"



test('Layout: empty schema', () => {
  expect(makeLayout(null, {})).toEqual([])
})


test('Layout: simple layout', () => {
  expect(makeLayout([
    'a:6'
  ])).toEqual([[{ __fake: true, type: 'a', name: 'a', width:6 }]])

  expect(makeLayout([
    ['a:6']
  ])).toEqual([[{ __fake: true, type: 'a', name: 'a', width:6 }]])
})

test('Layout: from simplified schema', () => {
  expect(makeLayout(null, {
    username: ''
  })).toEqual([[{
    type: 'string',
    name: 'username',
    width: 0,
  }]])

  expect(makeLayout(null, {
    id: 0
  })).toEqual([[{
    type: 'number',
    name: 'id',
    width: 0,
  }]])

  expect(makeLayout(null, {
    isWtf: false
  })).toEqual([[{
    type: 'boolean',
    name: 'isWtf',
    width: 0,
  }]])
})