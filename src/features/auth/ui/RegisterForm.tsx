import { TextInput, Button, Box } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useTranslation } from 'react-i18next'

export function RegisterForm() {
  const { t } = useTranslation()
  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  return (
    <Box component="form" onSubmit={form.onSubmit((values) => console.log(values))}>
      <TextInput
        label={t('ui.modals.nameField')}
        placeholder={t('ui.modals.nameField')}
        {...form.getInputProps('name')}
        mb="md"
      />
      <TextInput
        label={t('ui.modals.emailField')}
        placeholder={t('ui.modals.emailField')}
        {...form.getInputProps('email')}
        mb="md"
      />
      <TextInput
        label={t('ui.modals.passwordField')}
        placeholder={t('ui.modals.passwordField')}
        {...form.getInputProps('password')}
        mb="md"
      />
      <Button type="submit" fullWidth>
        {t('ui.modals.registerButton')}
      </Button>
    </Box>
  )
}
