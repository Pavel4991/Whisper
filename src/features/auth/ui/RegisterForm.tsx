import { TextInput, Button, Box, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useTranslation } from 'react-i18next'
import { registerFormConfig } from '@/features/auth/model/registerFormConfig'
import { useRegister } from '../api/useRegister'

export function RegisterForm() {
  const { t } = useTranslation()
  const form = useForm({
    initialValues: {
      username: '',
      password: '',
      passwordConfirm: '',
    },
  })

  const { mutate: register, isPending, error } = useRegister()

  return (
    <Box component="form" onSubmit={form.onSubmit((values) => register(values))}>
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
