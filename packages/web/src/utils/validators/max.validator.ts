import { StringSchema } from 'yup'

export const max = (max = 0) => (YupInstance: StringSchema) => YupInstance
  .test(
    'max',
    `Deve ser menor ou igual à ${ max }`,
    (value) => !value || Number(value) <= max
  )
