import type { Channel } from '@/entities/channel/model/types'

type RemoveChannelPayload = Pick<Channel, 'id'>

export function upsertChannelToCache(
  existing: Channel[] | undefined,
  incoming: Channel,
): Channel[] {
  if (existing?.some((channel) => channel.id === incoming.id))
    return existing.map((channel) => (channel.id === incoming.id ? incoming : channel))
  return existing ? [...existing, incoming] : [incoming]
}

export function removeChannelFromCache(
  existing: Channel[] | undefined,
  channelId: RemoveChannelPayload,
): Channel[] {
  return existing ? existing.filter((channel) => channel.id !== channelId.id) : []
}
