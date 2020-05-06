
/**
 * 
 */
export const uniqId = (() => {
  let id = +new Date
  return () => `superform-${++id}`
})()

/**
 * 
 */
export const noop = () => { }

/**
 * 
 */
export const nearest = (a, n, l) => {
  if ((l = a.length) < 2) {
    return l - 1
  }
  for (var l, p = Math.abs(a[--l] - n); l--;) {
    if (p < (p = Math.abs(a[l] - n))) {
      break
    }
  }
  return a[l + 1] > n ? l : l + 1
}


const LAYOUT_REGEXP = /^([\w\d]+)\:?(\d+)?/i

export const makeLayout = (layout, schema) => {
  const resultLayout = []

  const makeField = fieldname => {
    const [src, name, width = 0] = fieldname.match(LAYOUT_REGEXP)

    if (schema && schema[name] !== undefined) {
      return {
        type: typeof schema[name],
        name,
        width: width ? Number(width) : 0,
        ...schema[name],
      }
    }

    return {
      type: name,
      name,
      __fake: true,
      width: width ? Number(width) : 0,
    }
  }

  if (layout) {
    layout.forEach(field => {
      if (Array.isArray(field)) {
        resultLayout.push(field.map(f =>
          makeField(f)
        ))
      } else {
        resultLayout.push([makeField(field)])
      }
    })
  } else {
    Object.keys(schema).forEach(key => {
      if (key.indexOf('__') === 0) {
        return
      }
      resultLayout.push([makeField(key)])
    })
  }
  return resultLayout
}

const getSchemaFieldType = (fieldObj, value) => {

  if(Array.isArray(fieldObj)) {
    return {
      type: 'array',
      of: getSchemaFieldType(fieldObj[0], value)
    }
  }

  if (fieldObj.type) {
    return fieldObj.type
  }
  if (fieldObj.value !== undefined) {
    return typeof fieldObj.value
  }
  if (fieldObj.defaultValue !== undefined) {
    return typeof fieldObj.defaultValue
  }
  if (value && value[fieldObj.name] !== undefined) {
    return typeof value[fieldObj.name]
  }
  return typeof fieldObj
}


export const makeSchema = (schema, formValue) => {
  const rschema = {}
  if (formValue) {
    Object
      .keys(formValue)
      .forEach(name => {
        const type = getSchemaFieldType(formValue[name], formValue)
        
        if (typeof type === 'string') {
          rschema[name] = {name, type}
        } else {
          rschema[name] = { name, ...type }

          if (!rschema[`__${type.of}`])  {
            rschema[`__${type.of}`] = makeSchema(null, formValue[name][0])
            rschema[`__${type.of}`].__ignore = true
          }
        }


        if (typeof formValue[name] === 'object') {
          if (formValue[name]) {
            Object.assign(rschema[name], formValue[name])
          }
        } else {
          rschema[name].defaultValue = formValue[name]
        }

      })
  }

  if (schema) {
    if (Array.isArray(schema)) {
      schema.forEach(fieldObj => {
        if (!fieldObj.name) {
          throw new Error('Field MUST have `name` propery')
        }
        if (rschema[fieldObj.name]) {
          Object.assign(rschema[fieldObj.name], {
            type: getSchemaFieldType(fieldObj, formValue),
            ...fieldObj,
          })
        } else {
          rschema[fieldObj.name] = {
            type: getSchemaFieldType(fieldObj, formValue),
            ...fieldObj,
          }
        }

        // console.log('rschema[fieldObj.name]: ', rschema[fieldObj.name]);
      })
    } else {
      Object.keys(schema).forEach(fieldName => {
        const fieldObj = schema[fieldName]
        if (rschema[fieldName]) {
          Object.assign(rschema[fieldName], {
            name: fieldName,
            type: getSchemaFieldType(fieldObj, formValue),
            ...fieldObj,
          })
        } else {
          rschema[fieldName] = {
            name: fieldName,
            type: getSchemaFieldType(fieldObj, formValue),
            ...fieldObj,
          }

        }

        // console.log('rschema[fieldName]: ', rschema[fieldName]);
      })
    }
  }
  return rschema
}

export const importField = (field) => {

}

export const exportField = (field) => {

}