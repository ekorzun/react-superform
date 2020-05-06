import {
  uniqId, 
  noop,
  nearest
} from "../src/utils"



test('Unique id', () => {
  const id = uniqId().replace('superform-', '')
  const id2 = uniqId().replace('superform-', '')
  expect(id2-id).toEqual(1)
})

test('noop', () => {
  expect(noop()).toEqual(undefined)
})


test('nearest', () => {
  const arr = [10, 20, 50, 100, 125, 200]
  const t1 = nearest(arr, 190)
  expect(arr[t1]).toEqual(125)
  const t2 = nearest(arr, 100)
  expect(arr[t2]).toEqual(100)
  const t3 = nearest(arr, 90)
  expect(arr[t3]).toEqual(50)
})

