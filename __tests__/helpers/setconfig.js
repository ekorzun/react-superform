import Baobab from 'baobab'
import { setConfig } from 'react-supermodel'

const tree = new Baobab({
  $api: {}
}, {
  asynchronous: false
})

setConfig({
  tree,
  prefix: 'https://jsonplaceholder.typicode.com',
})