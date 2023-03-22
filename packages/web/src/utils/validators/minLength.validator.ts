import { StringSchema } from 'yup'

export const minLength = (min: number) => (YupInstance: StringSchema) => YupInstance.test(
  'minLength',
  `Deve conter no mínimo ${ min } caracteres`,
  (value) => !value || value.length >= min
)
