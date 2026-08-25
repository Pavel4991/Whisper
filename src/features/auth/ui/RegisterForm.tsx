import { TextInput, Button, Box, Text } from '@mantine/core'
import { useForm, schemaResolver } from '@mantine/form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { createTranslatedResolver } from '@/shared/lib'

import { registerFormConfig } from '@/features/auth/model/registerFormConfig'
import { useRegister } from '../api/useRegister'

import { usernameSchema, passwordSchema } from '@/shared/validation'
import * as z from 'zod'

const registerSchema = z
  .object({
    username: usernameSchema,
    password: passwordSchema,
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'validation.passwordsDoNotMatch',
    path: ['passwordConfirm'],
  })

export function RegisterForm() {
  const { t } = useTranslation()
  const form = useForm({
    initialValues: {
      username: '',
      password: '',
      passwordConfirm: '',
    },
    validate: createTranslatedResolver(schemaResolver(registerSchema, { sync: true }), t),
    validateInputOnBlur: true,
  })

  const { mutate: register, isPending, error } = useRegister()

  const navigate = useNavigate()

  return (
    <Box
      component="form"
      onSubmit={form.onSubmit((values) =>
        register(
          { username: values.username, password: values.password },
          { onSuccess: () => navigate('/chat', { replace: true }) },
        ),
      )}
    >
      {registerFormConfig.map((field) => (
        <TextInput
          key={field.name}
          label={t(field.tKey)}
          placeholder={t(field.tKey)}
          {...form.getInputProps(field.name)}
          mb="md"
        />
      ))}
      <Button type="submit" disabled={isPending} fullWidth>
        {t('ui.modals.registerButton')}
      </Button>
      {error && <Text color="red">Ошибка: {error.message}</Text>}
    </Box>
  )
}
