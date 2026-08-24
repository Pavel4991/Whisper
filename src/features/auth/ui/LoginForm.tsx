import { TextInput, Button, Box, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useTranslation } from 'react-i18next'
import { loginFormConfig } from '@/features/auth/model/loginFormConfig'
import { useLogin } from '../api/useLogin'

export function LoginForm() {
  const { t } = useTranslation()
  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
  })

  const { mutate: login, isPending, error } = useLogin()

  return (
    <Box component="form" onSubmit={form.onSubmit((values) => login(values))}>
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
