'use client'

import { createContext, MutableRefObject } from 'react'
import { AlertDialogModalSettings, Chat, ChatMessage, ClusterSettings, Persona, SearchResult } from './interface'

const ChatContext = createContext<{
  debug?: boolean
  personaPanelType: string
  DefaultPersonas: Persona[]
  currentChat?: Chat
  chatList: Chat[]
  personas: Persona[]
  isOpenPersonaModal?: boolean
  editPersona?: Persona
  personaModalLoading?: boolean
  openPersonaPanel?: boolean
  toggleSidebar?: boolean
  lastSearchResults: SearchResult[],
  toggleSearchResultsPane: boolean,
  clusterSettings?: ClusterSettings
  isClusterSettingsModalOpen: boolean
  isAlertDialogModalOpen: boolean,
  alertDialogModalSettings?: AlertDialogModalSettings,
  onOpenPersonaModal?: () => void
  onClosePersonaModal?: () => void
  setCurrentChat?: (chat: Chat) => void
  onCreatePersona?: (persona: Persona) => void
  onDeleteChat?: (chat: Chat) => void
  onDeleteAllChat?: () => void
  onDeletePersona?: (persona: Persona) => void
  onEditPersona?: (persona: Persona) => void
  onStartChat?: () => void
  onCreateChat?: (chat: Chat) => void
  onChangeChat?: (chat: Chat) => void
  onOpenPersonaPanel?: (type?: string) => void
  onClosePersonaPanel?: () => void
  onToggleSidebar?: () => void
  forceUpdate?: () => void
  onLastSearchChange?: (searchResults: SearchResult[]) => void
  onToggleSearchResultsPane?: () => void
  onClusterSettingsChange?: (settings: ClusterSettings) => void
  openClusterSettingsModal?: () => void
  closeClusterSettingsModal?: () => void
  closeAlertDialogModal?: () => void
}>({
  personaPanelType: 'chat',
  DefaultPersonas: [],
  chatList: [],
  personas: [],
  lastSearchResults: [],
  toggleSearchResultsPane: false,
  isClusterSettingsModalOpen: false,
  isAlertDialogModalOpen: false
})

export default ChatContext
