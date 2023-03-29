import isNaN from 'lodash/isNaN'
import { StringSchema } from 'yup'

import { fixStrNumber } from '../formatters'

export const number = () => (YupInstance: StringSchema) => YupInstance.test(
  'number',
  'Campo numérico',
  (value) => !value || !isNaN(Number(fixStrNumber(value)))
)
