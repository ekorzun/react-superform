import connect, { Model, setConfig } from 'react-supermodel'
import Baobab from 'baobab'

const tree = new Baobab({
  $api: {}
})

setConfig({ 
  tree,
  prefix: 'https://reqres.in/api'
})

export const ProfModel = new Model({
  name: 'Prof',
  api: {
    list: '/unknown'
  },
})
