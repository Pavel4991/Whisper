import { Button, Box, Text, Anchor } from '@mantine/core'
import { useForm, schemaResolver } from '@mantine/form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { createTranslatedResolver } from '@/shared/lib'

import { loginFormConfig } from '@/features/auth/model/loginFormConfig'
import { useLogin } from '../api/useLogin'
import { useModalStore } from '../model/modalStore'

import { requiredStringSchema } from '@/shared/validation'
import * as z from 'zod'

import { AuthField } from './AuthField'

const loginSchema = z.object({ username: requiredStringSchema, password: requiredStringSchema })

export function LoginForm() {
  const { t } = useTranslation()
  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
    validate: createTranslatedResolver(schemaResolver(loginSchema, { sync: true }), t),
    validateInputOnBlur: true,
  })

  const { mutate: login, isPending, error } = useLogin()

  const navigate = useNavigate()
  const openRegisterModal = useModalStore((state) => state.openRegisterModal)
  const closeModal = useModalStore((state) => state.closeModal)

  return (
    <Box
      component="form"
      onSubmit={form.onSubmit((values) =>
        login(values, {
          onSuccess: () => {
            void navigate('/chat', { replace: true })
            closeModal()
          },
        }),
      )}
    >
      {loginFormConfig.map((field) => (
        <AuthField
          key={field.name}
          fieldName={field.name}
          label={t(field.tKey)}
          error={form.errors[field.name]}
          inputProps={form.getInputProps(field.name, { withError: false })}
        />
      ))}
      <Button type="submit" disabled={isPending} fullWidth mb={10}>
        {t('ui.authModals.loginButton')}
      </Button>
      {error && (
        <Text ta="center" c="red" data-testid="login-form-server-error">
          {t('ui.authModals.serverError')} {error.message}
        </Text>
      )}
      <Text ta="center" fz="sm" c="var(--mantine-color-gray-7)" mt={24}>
        {t('ui.authModals.registerRedirectionText')}
        <Anchor
          href="#"
          fz="sm"
          onClick={(e) => {
            e.preventDefault()
            openRegisterModal()
          }}
        >
          {t('ui.authModals.registerButton')}
        </Anchor>
      </Text>
    </Box>
  )
}
