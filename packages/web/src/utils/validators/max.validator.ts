import { StringSchema } from 'yup'

import { fixStrNumber } from '../formatters'

export const max = (max = 0) => (YupInstance: StringSchema) => YupInstance
  .test(
    'max',
    `Deve ser menor ou igual à ${ max }`,
    (value) => !value || Number(fixStrNumber(value)) <= max
  )
