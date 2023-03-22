import { StringSchema } from 'yup'

export const regex = (reg: RegExp, message: string) => (YupInstance: StringSchema) => YupInstance.matches(reg, message)
