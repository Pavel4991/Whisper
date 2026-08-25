import * as z from 'zod'

export const requiredStringSchema = z.string().min(1, 'validation.requiredField')

export const usernameSchema = z
  .string()
  .min(3, 'validation.usernameTooShort')
  .max(20, 'validation.usernameTooLong')

export const passwordSchema = z.string().min(6, 'validation.passwordTooShort')
