import type { FormErrors } from '@mantine/form'
import type { TFunction } from 'i18next'

/**
 * Обертка над резолвером Mantine, которая автоматически переводит ключи ошибок Zod.
 */
export function createTranslatedResolver<T>(resolver: (values: T) => FormErrors, t: TFunction) {
  return (values: T): FormErrors => {
    const errors = resolver(values)

    if (Object.keys(errors).length === 0) {
      return errors
    }

    const translatedErrors: FormErrors = {}

    for (const [key, errorKey] of Object.entries(errors)) {
      if (typeof errorKey === 'string') {
        translatedErrors[key] = t(errorKey)
      } else {
        translatedErrors[key] = errorKey
      }
    }

    return translatedErrors
  }
}
