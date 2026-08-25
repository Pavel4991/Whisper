import { TextInput, Button, Box, Text } from '@mantine/core'
import { useForm, schemaResolver } from '@mantine/form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { createTranslatedResolver } from '@/shared/lib'

import { loginFormConfig } from '@/features/auth/model/loginFormConfig'
import { useLogin } from '../api/useLogin'

import { requiredStringSchema } from '@/shared/validation'
import * as z from 'zod'

const loginSchema = z.object({ username: requiredStringSchema, password: requiredStringSchema })

export function LoginForm() {
  const { t } = useTranslation()
  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
    validate: createTranslatedResolver(schemaResolver(loginSchema, { sync: true }), t),
  })

  const { mutate: login, isPending, error } = useLogin()

  const navigate = useNavigate()

  return (
    <Box
      component="form"
      onSubmit={form.onSubmit((values) =>
        login(values, { onSuccess: () => navigate('/chat', { replace: true }) }),
      )}
    >
      {loginFormConfig.map((field) => (
        <TextInput
          key={field.name}
          label={t(field.tKey)}
          placeholder={t(field.tKey)}
          {...form.getInputProps(field.name)}
          mb="md"
        />
      ))}
      <Button type="submit" disabled={isPending} fullWidth>
        {t('ui.modals.loginButton')}
      </Button>
      {error && <Text color="red">Ошибка: {error.message}</Text>}
    </Box>
  )
}
