import { Button, Box, Text, Anchor } from '@mantine/core'
import { useForm, schemaResolver } from '@mantine/form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { createTranslatedResolver } from '@/shared/lib'

import { registerFormConfig } from '@/features/auth/model/registerFormConfig'
import { useRegister } from '../api/useRegister'

import { usernameSchema, passwordSchema } from '@/shared/validation'
import { useModalStore } from '../model/modalStore'
import * as z from 'zod'

import { AuthField } from './AuthField'

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
  const openLoginModal = useModalStore((state) => state.openLoginModal)
  const closeModal = useModalStore((state) => state.closeModal)

  return (
    <Box
      component="form"
      onSubmit={form.onSubmit((values) =>
        register(
          { username: values.username, password: values.password },
          {
            onSuccess: () => {
              navigate('/chat', { replace: true })
              closeModal()
            },
          },
        ),
      )}
    >
      {registerFormConfig.map((field) => (
        <AuthField
          key={field.name}
          fieldName={field.name}
          label={t(field.tKey)}
          error={form.errors[field.name]}
          inputProps={form.getInputProps(field.name, { withError: false })}
        />
      ))}
      <Button type="submit" disabled={isPending} fullWidth mb={10}>
        {t('ui.authModals.registerButton')}
      </Button>
      {error && (
        <Text ta="center" c="red" data-testid="register-form-server-error">
          {t('ui.authModals.serverError')} {error.message}
        </Text>
      )}
      <Text ta="center" fz="sm" c="var(--mantine-color-gray-7)" mt={24}>
        {t('ui.authModals.loginRedirectionText')}
        <Anchor
          href="#"
          fz="sm"
          onClick={(e) => {
            e.preventDefault()
            openLoginModal()
          }}
        >
          {t('ui.authModals.loginButton')}
        </Anchor>
      </Text>
    </Box>
  )
}
