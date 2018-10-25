
export const makeLayout = (layout, schema) => {
  const rlayout = []
  if (layout) {
    layout.forEach(field => {
      if(Array.isArray(field)){
        rlayout.push(field.map(f => {
          return schema[f]
        }))
      } else {
        rlayout.push(schema[field])
      }
    })
  } else {
    Object.keys(schema).forEach(key => {
      rlayout.push(schema[key])
      
    })
  }
  return rlayout
}

const getSchemaFieldType = (fieldObj, value) => {
  let type = fieldObj.type
  if(type) {return type}
  if (typeof fieldObj.value !== 'undefined') {
    return typeof fieldObj.value
  }
  if(value && value[fieldObj.name] !== undefined) {
    return typeof value[fieldObj.name]
  }
  return 'string'
}


export const makeSchema = (schema, value) => {
  const rschema = {}
  if(schema) {
    if (Array.isArray(schema)) {
      schema.forEach(fieldObj => {
        if(!fieldObj.name) {
          throw new Error('Field MUST have `name` propery')
        }
        rschema[fieldObj.name] = {
          type: getSchemaFieldType(fieldObj, value),
          ...fieldObj,
        }

        // console.log('rschema[fieldObj.name]: ', rschema[fieldObj.name]);
      })
    } else {
      Object.keys(schema).forEach(fieldName => {
        const fieldObj = schema[fieldName]
        rschema[fieldName] = {
          name: fieldName,
          type: getSchemaFieldType(fieldObj, value),
          ...fieldObj,
        }

        // console.log('rschema[fieldName]: ', rschema[fieldName]);
      })
    }
  }
  if(value) {
    Object.keys(value).forEach(name => {
      rschema[name] = {
        name,
        type: getSchemaFieldType(value[name], value),
      }
      if (typeof value[name] === 'object') {
        if (value[name]) {
          Object.assign(rschema[name], value[name])
        }
      } else {
        rschema[name].value = value[name]
      }

    })
  }
  return rschema
}

export const importField = (field) => {

}

export const exportField = (field) => {

}