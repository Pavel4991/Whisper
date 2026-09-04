export interface AddMessagePayload {
  body: string
  channelId: string
  username: string
}

export interface EditMessagePayload {
  id: string
  body: string
}

export interface RemoveMessagePayload {
  id: string
}
