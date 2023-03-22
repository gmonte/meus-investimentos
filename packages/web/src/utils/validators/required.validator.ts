import isBoolean from 'lodash/isBoolean'
import isEmpty from 'lodash/isEmpty'
import isNumber from 'lodash/isNumber'
import isString from 'lodash/isString'
import { AnySchema } from 'yup'

export const required = () => (YupInstance: AnySchema) => YupInstance.test(
  'required',
  'Campo obrigatório',
  (value) => {
    if (isString(value)) {
      return !isEmpty(value.trim())
    }

    return (
      !isEmpty(value) ||
      isNumber(value) ||
      isBoolean(value) ||
      value instanceof File
    )
  }
)
