import { Paper, Text } from '@mantine/core'
import type { Message } from '../model/types'
import classes from './MessageItem.module.css'

interface MessageItemProps {
  message: Message
  currentUser: string
}

export function MessageItem({ message, currentUser }: MessageItemProps) {
  const isCurrentUser = message.username === currentUser

  return (
    <Paper className={classes.root} data-owner={isCurrentUser ? 'current' : 'other'}>
      {isCurrentUser ? null : <Text fz={10}>{message.username}</Text>}
      <Text fz={15}>{message.body}</Text>
    </Paper>
  )
}
