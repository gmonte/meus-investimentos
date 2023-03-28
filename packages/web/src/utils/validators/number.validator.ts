import isNaN from 'lodash/isNaN'
import { StringSchema } from 'yup'

export const number = () => (YupInstance: StringSchema) => YupInstance.test(
  'number',
  'Campo numérico',
  (value) => !value || !isNaN(Number(value))
)
