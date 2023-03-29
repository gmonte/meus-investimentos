import moment from 'moment/moment'
import { StringSchema } from 'yup'

export const date = () => (YupInstance: StringSchema) => YupInstance
  .test('date', 'Informe uma data válida', (value) => !value || moment(value, 'L', true).isValid())
