import { useMemo } from "react"



export const useArrayOf = (field: any, schema: any, onChange: any) => {
  // console.log('field', schema[`__${field.of}`])
  return useMemo(() => {
    const subschema = schema[`__${field.of}`]
    return {
      subschema,
      push: (Value: any) => {
        const newItem = Object.values(subschema || schema)
          .filter((p: any) => p.defaultValue !== undefined)
          .reduce((acc: any, prop: any) => {
            acc[prop.name] = prop.defaultValue
            return acc
          }, {})

        onChange({
          type: 'add',
          name: field.name,
          target: {
            name: field.name,
            value: [...(Value || []), newItem],
          },
        })
      },
      update: (e: any, Value: any, index: any) => {
        const { name, value: itemValue } = e.target
        const newValue = Value.map((item: any, i: any) => {
          return i !== index ? item : {
            ...item,
            ...itemValue
          }
        })

        onChange({
          index,
          type: 'update',
          target: {
            // name,
            name: field.name,
            value: newValue
          },
        })
      },
      remove: (Value: any, index: any) => {
        onChange({
          type: 'remove',
          name: field.name,
          target: {
            name: field.name,
            value: Value.filter((x: any, i: any) => i !== index)
          },
        })
      }

    }
  }, [field, schema])
}