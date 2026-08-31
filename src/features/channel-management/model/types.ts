export interface CreateChannelPayload {
  name: string
}

export interface RenameChannelPayload {
  id: string
  name: string
}

export interface RemoveChannelPayload {
  id: string
}
