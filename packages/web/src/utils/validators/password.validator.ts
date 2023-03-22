import flow from 'lodash/fp/flow'
import { StringSchema } from 'yup'

import { minLength } from './minLength.validator'
import { regex } from './regex.validator'

export const password = () => (YupInstance: StringSchema) => flow(
  minLength(6),
  regex(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/,
    'Deve conter ao menos 1 letra maiúscula, 1 letra minúscula e 1 número'
  )
)(YupInstance)
