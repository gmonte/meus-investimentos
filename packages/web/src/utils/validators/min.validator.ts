import { StringSchema } from 'yup'

export const min = (min = 0) => (YupInstance: StringSchema) => YupInstance
  .test(
    'min',
    `Deve ser maior ou igual à ${ min }`,
    (value) => !value || Number(value) >= min
  )
