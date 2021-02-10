
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
// @ts-ignore
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

// name:width
// name->type
const LAYOUT_REGEXP = new RegExp([
  `^`,
  // name
  `(\\w[\\-\\_\\w\\d]+)`,
  // ->type
  `(?:\\->?(\\w[\\w\\-\\_\\d]+))?`,
  // :width
  `\\:?(\\d+)?`,
  `$`
].join(''), 'i')

export const makeLayout = (layout: any, schema: any) => {
  const resultLayout = [] as any[]

  const makeField = (fieldname: any) => {

    const [
      src, 
      name, 
      renderAs,
      width = 0
    ] = fieldname.match(LAYOUT_REGEXP)



    if (schema && schema[name] !== undefined) {
      return {
        renderAs,
        type: typeof schema[name],
        name,
        width: width ? Number(width) : 0,
        ...schema[name],
      }
    }

    return {
      renderAs,
      type: name,
      name,
      __fake: true,
      width: width ? Number(width) : 0,
    }
  }

  if (layout) {
    layout.forEach((field: any) => {
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


const getSchemaFieldType = (
  fieldObj: any,
  value: any
) => {


  // if(fieldObj && typeof fieldObj === 'object')

  if (!fieldObj) {
    if(Array.isArray(value)) {
      return {
        type: 'array',
        of: getSchemaFieldType(fieldObj[0], value)
      }
    }

    if (value && value[fieldObj?.name] !== undefined) {
      return typeof value[fieldObj.name]
    }
    return typeof fieldObj
  }

  if (Array.isArray(fieldObj)) {
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


export const makeSchema = (schema: any, formValue: any) => {

  // console.log(`schema`, schema)
  // console.log(`formValue`, formValue)

  const resultSchema = {} as {[key:string]:any}


  // Generate first part of schema using form value
  // and values types detection
  // if (formValue) {
  //   Object
  //     .keys(formValue)
  //     .forEach((name: any) => {

  //       // console.log('makeSchema:', name, formValue, schema)

  //       const type = getSchemaFieldType(formValue[name], formValue)

  //       if (typeof type === 'string') {
  //         resultSchema[name] = { name, type }
  //       } else {
  //         resultSchema[name] = { name, ...type }

  //         if (!resultSchema[`__${type.of}`]) {
  //           resultSchema[`__${type.of}`] = makeSchema(null, formValue[name][0])
  //           resultSchema[`__${type.of}`].__ignore = true
  //         }
  //       }


  //       if (typeof formValue[name] === 'object') {
  //         if (formValue[name]) {
  //           Object.assign(resultSchema[name], formValue[name])
  //         }
  //       } else {
  //         resultSchema[name].defaultValue = formValue[name]
  //       }

  //     })
  // }


  if (Array.isArray(schema)) {
    throw new Error(`Currently array schema doesnt supported`)
    // schema.forEach(fieldObj => {
    //   if (!fieldObj.name) {
    //     throw new Error('Field MUST have `name` propery')
    //   }
    //   if (resultSchema[fieldObj.name]) {
    //     Object.assign(resultSchema[fieldObj.name], {
    //       type: getSchemaFieldType(fieldObj, formValue),
    //       ...fieldObj,
    //     })
    //   } else {
    //     resultSchema[fieldObj.name] = {
    //       type: getSchemaFieldType(fieldObj, formValue),
    //       ...fieldObj,
    //     }
    //   }

    //   // console.log('resultSchema[fieldObj.name]: ', resultSchema[fieldObj.name]);
    // })
  }

  // Schema objhect is passed
  if (schema && typeof schema === 'object') {

      Object.keys(schema).forEach(fieldName => {

        // schema[ field_name ] = {type, label, etc ... }
        const fieldObj = schema[fieldName]

        if (
          // It is possible that schema could be predefined
          // from form value/defaultValue
          resultSchema[fieldName]
        ) {
          return Object.assign(resultSchema[fieldName], {
            name: fieldName,
            type: getSchemaFieldType(fieldObj, formValue),
            ...fieldObj,
          })
        }


        
        resultSchema[fieldName] = {
          name: fieldName,
          type: getSchemaFieldType(fieldObj, formValue),
          ...fieldObj,
        }
      })
    }

  return resultSchema
}

export const importField = (field: any) => {

}

export const exportField = (field: any) => {

}


export const log = (...p) => process.env.NODE_ENV !== 'production' ? console.log(p) : null