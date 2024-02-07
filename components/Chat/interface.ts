export interface ChatMessage {
  content: string
  role: ChatRole
}

export interface Persona {
  id?: string
  role: ChatRole
  avatar?: string
  name?: string
  prompt?: string
  key?: string
  isDefault?: boolean
}

export interface Chat {
  id: string
  conversationId?: string
  name?: string
  messages: ChatMessage[]
}

export interface SearchResult {
  id: number
  text: string
  score: number
}

export interface OpenSearchConversation {
  conversation_id: string,
  name: string
}

export interface OpenSearchInteraction {
  input: string,
  response: string
}

export interface ClusterSettings {
  endpoint: string,
  username: string,
  password: string,
}

export type ChatRole = 'assistant' | 'user' | 'system'
