import { Box, Textarea, ActionIcon, Group } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useAddMessage } from '../model/useAddMessage'
import { IconSend2 } from '@tabler/icons-react'
import classes from './MessageInput.module.css'
import { useTranslation } from 'react-i18next'

export function MessageInput({
  channelId,
  username,
}: {
  channelId: string | null
  username: string | null
}) {
  const { t } = useTranslation()
  const form = useForm({
    initialValues: {
      body: '',
    },
    transformValues: (values) => ({
      body: values.body.trim(),
    }),
  })

  const { mutate: addMessage, isPending } = useAddMessage()

  const canSend = !!channelId && !!username && form.values.body.trim().length > 0

  const handleSubmit = (values: { body: string }) => {
    if (!canSend) return
    addMessage(
      {
        channelId,
        username,
        ...values,
      },
      { onSuccess: () => form.reset() },
    )
  }
  return (
    <Box
      component="form"
      onSubmit={form.onSubmit(handleSubmit)}
      w="100%"
      style={{ flexShrink: 0, borderTop: '1px solid var(--mantine-color-gray-3)' }}
      px={24}
      py={14}
    >
      <Group h="100%" align="center" wrap="nowrap">
        <Textarea
          name="body"
          classNames={{ input: classes.textareaInput }}
          placeholder={t('ui.chatPage.messageInput')}
          minRows={1}
          maxRows={4}
          w="100%"
          radius="xl"
          autosize
          style={{ resize: 'none' }}
          {...form.getInputProps('body')}
          data-testid="message-input"
          aria-label={t('ui.chatPage.messageInput')}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey && canSend && !isPending) {
              event.preventDefault()
              form.onSubmit(handleSubmit)()
            }
          }}
        />
        <ActionIcon
          className={classes.sendButton}
          size={48}
          radius="xl"
          type="submit"
          disabled={!canSend || isPending}
          style={{ cursor: 'pointer' }}
          aria-label={t('ui.chatPage.sendButton')}
        >
          <IconSend2 />
        </ActionIcon>
      </Group>
    </Box>
  )
}
