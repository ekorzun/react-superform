// @ts-nocheck
import RULES from './rules'
import { generateMessage } from './placeholders'



export const validateForm = (formData, includeMessages = true) => {

    if (formData === undefined) {
        console.warn(`No formData specified to validateForm.\
            Make sure to pass an object { formData: {} }`)
        return { errors: false }
    }

    const keys = Object.keys(formData)

    let bail = false

    let fields = []
    let errors = []
    let messages = []
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i]

        if (typeof formData[key] !== 'object') {
            continue
        }


        const validationString = formData[key].validation || ""
        const validation = typeof validationString === 'string'
            ? validationString.split('|')
            : validationString


        // if (typeof validationString === 'string' && validation.includes('bail')) {
        //     bail = true
        //     if (Object.keys(errors).length > 0 || errors.length) {
        //         break
        //     }
        //     // continue
        // }

        const fieldData = {
            ...formData[key],
            key,
            validation
        }

        if (fieldData.value === undefined) {
            fieldData.value = null
        }

        const result = validateField(fieldData, formData)

        if (result.errors) {
            fields.push(key)

            if (Array.isArray(result.errors)) {
                console.log('result.errors: ', JSON.stringify(result.errors))
                errors.push(result.errors)
            } else {
                // errors.push(Object.keys(result.errors))
                errors.push(result.errors)
            }

            if (includeMessages) {
                if (Array.isArray(result.errors)) {
                    const fieldMessages = result.errors.map(rule => generateMessage(rule, fieldData))
                    messages.push(fieldMessages)
                }
            }

            if (bail) {
                break
            }
        }
    }

    if (bail) {
        if (fields.length > 1) {//Only first field
            fields = fields.slice(0, 1)
            errors = errors.slice(0, 1)
        }

        if (errors[0].length > 1) {//Only first error
            errors[0] = errors[0].slice(0, 1)
        }
    }

    return {
        errors: errors.length === 0 ? false : errors.reduce((keyedErrors, fieldErrors, i) => {
            // console.log("messages", JSON.stringify(messages), JSON.stringify(keyedErrors))
            keyedErrors[fields[i]] = Array.isArray(fieldErrors)
                ? fieldErrors.map((rule, j) => includeMessages ? messages[i] ? messages[i][j] : rule : rule)
                : fieldErrors

            return keyedErrors
        }, {}),
    }
}

const parseRule = (rule) => {
    const ruleParts = rule.split(':')
    return {
        key: ruleParts[0],
        params: ruleParts[1] ? ruleParts[1].split(',') : [],
    }
}

// {key, value, validation}
export const validateField = (fieldData, formData) => {
    // console.log(JSON.stringify(fieldData))

    const values = formData && Object.keys(formData).reduce((values, key) => {
        values[key] = formData[key].value
        return values
    }, {})

    const validation = fieldData.validation

    if (!Array.isArray(validation)) {
        const subform = Object.keys(fieldData.value)
            .reduce((acc, key) => {
                // console.log('key: ', key)
                acc[key] = {
                    value: fieldData.value[key],
                    validation: validation[key]
                }
                return acc
            }, {})
        // console.log("subform", JSON.stringify(subform))
        const subresult = validateForm(subform)
        // console.log("subform", JSON.stringify(subresult))
        return subresult
    }

    const nullable = validation.includes('nullable')

    let errors = []
    for (let i = 0; i < validation.length; i++) {
        let rule
        try {
            rule = parseRule(validation[i])
        } catch (e) {
            console.warn(`Invalid rule on field ${fieldData.key} rule=${validation[i]}`)
            continue
        }

        if (rule.key === 'nullable') {
            continue
        }

        if (rule.key === "") {
            continue
        }

        if (!RULES[rule.key]) {
            console.warn(`Could not find rule on field ${fieldData.key} rule=${validation[i]}`)
            continue
        }

        if (nullable && !fieldData.value) {
            continue
        }

        //TODO custom handling for 'sometimes' rule

        const params = {
            ...rule,
            key: fieldData.key,
            value: fieldData.value,
            values,
        }

        let result = false
        let overrideNullable = false

        try {
            result = RULES[rule.key](params)
        } catch (e) {
            console.warn(`Error validating rule, most likely invalid params: rule${rule.key} field=${fieldData.key}`)
            overrideNullable = true
        }

        if (!result) {
            if (!overrideNullable && nullable && fieldData.value === null) {
                continue
            }
            errors.push(rule.key)
        }
    }

    return {
        errors: errors.length === 0 ? false : errors,
    }
}

export {
    validateForm as default,
    parseRule,
}