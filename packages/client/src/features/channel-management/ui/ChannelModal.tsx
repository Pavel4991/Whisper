import { Modal, Box, Button, Text, TextInput, Group } from '@mantine/core'
import { useForm, schemaResolver } from '@mantine/form'
import { useTranslation } from 'react-i18next'
import type { ChannelModalType } from '../model/types'
import { channelFormConfig } from '../model/channelFormConfig'

import { useCreateChannel } from '../model/useCreateChannel'
import { useRenameChannel } from '../model/useRenameChannel'
import { useRemoveChannel } from '../model/useRemoveChannel'
import { useChannelById } from '@/entities/channel'
import { channelNameSchema } from '@/shared/validation'
import { createTranslatedResolver } from '@/shared/lib'
import { z } from 'zod'
import { notifications } from '@mantine/notifications'
import { IconCheck } from '@tabler/icons-react'

interface ChannelModalProps {
  readonly modalType: ChannelModalType
  readonly isOpened: boolean
  readonly onClose: () => void
  readonly channelId: string
}

export function ChannelModal({ modalType, isOpened, onClose, channelId }: ChannelModalProps) {
  const { t } = useTranslation()
  const { mutate: createChannel, isPending: isCreating, error: createError } = useCreateChannel()
  const { mutate: renameChannel, isPending: isRenaming, error: renameError } = useRenameChannel()
  const { mutate: removeChannel, isPending: isRemoving, error: removeError } = useRemoveChannel()
  const { data: channel } = useChannelById(channelId)

  const isPending = isCreating || isRenaming || isRemoving
  const currentError = createError || renameError || removeError

  const channelSchema = z.object({ name: channelNameSchema })

  const form = useForm({
    initialValues: {
      name: '',
    },
    validate:
      modalType !== 'removeChannel'
        ? createTranslatedResolver(schemaResolver(channelSchema, { sync: true }), t)
        : () => ({}),
  })

  const channelHandler = (values: typeof form.values) => {
    const oldName = channel?.name
    const mutationConfig = {
      onSuccess: () => {
        form.reset()
        onClose()
        notifications.show({
          icon: <IconCheck />,
          message: t(`ui.notifications.onSuccess.${modalType}`, {
            oldName,
            newName: values.name,
          }),
        })
      },
    }

    switch (modalType) {
      case 'createChannel':
        createChannel({ name: values.name }, mutationConfig)
        break
      case 'renameChannel':
        renameChannel({ id: channelId, name: values.name }, mutationConfig)
        break
      case 'removeChannel':
        removeChannel({ id: channelId }, mutationConfig)
        break
      default:
        break
    }
  }

  return (
    <Modal title={t(`ui.channelModals.${modalType}`)} opened={isOpened} onClose={onClose}>
      <Box component="form" onSubmit={form.onSubmit(channelHandler)}>
        {modalType === 'removeChannel' ? (
          <Text mb={10} data-testid="channel-remove-confirmation">
            {t('ui.channelModals.removeChannelConfirm')}
          </Text>
        ) : (
          <TextInput
            mb={10}
            aria-label={t(`ui.channelModals.${modalType}`)}
            errorProps={{ 'data-testid': `channel-name-error` }}
            {...form.getInputProps('name')}
            disabled={isPending}
          />
        )}

        {currentError && (
          <Text color="red" data-testid="channel-modal-server-error" mt={10}>
            Ошибка сервера: {currentError.message}
          </Text>
        )}

        <Group justify="flex-end">
          <Button type="button" variant="subtle" onClick={onClose} disabled={isPending}>
            {t(channelFormConfig[modalType].cancelTkey)}
          </Button>
          <Button type="submit" loading={isPending}>
            {t(channelFormConfig[modalType].submitTKey)}
          </Button>
        </Group>
      </Box>
    </Modal>
  )
}
