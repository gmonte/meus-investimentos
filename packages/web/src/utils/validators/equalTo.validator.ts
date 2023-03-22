import isEqual from 'lodash/isEqual'
import { StringSchema } from 'yup'

export const equalTo = (fieldName: string, fieldLabel: string) => (YupInstance: StringSchema) => YupInstance.test(
  'equal',
  `Não é igual ao campo "${ fieldLabel }"`,
  (value, { parent }) => !value || isEqual(value, parent?.[fieldName])
)
