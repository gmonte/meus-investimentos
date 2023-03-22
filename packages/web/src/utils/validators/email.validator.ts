import { StringSchema } from 'yup'

export const email = () => (YupInstance: StringSchema) => YupInstance.email('Informe um e-mail válido')
