'use client'

import { Flex } from '@radix-ui/themes'
import { Chat, ChatContext, ChatSideBar, PersonaPanel, useChatHook } from '@/components'
import SearchResultsPane from '@/components/Chat/SearchResultsPane'
import ClusterSettingsModal from './ClusterSettingsModal'
import { Header } from '@/components/Header'

const ChatPage = () => {
  const provider = useChatHook()

  return (
    <ChatContext.Provider value={provider}>
      <Header />
      <Flex style={{ height: 'calc(100% - 56px)' }} className="relative">
        <ChatSideBar />
        <div className="flex-1 relative">
          <Chat />
        </div>
        {provider.toggleSearchResultsPane &&
          <div className="flex-1 relative">
            <SearchResultsPane />
          </div>}
      </Flex>
      <ClusterSettingsModal />
    </ChatContext.Provider>
  )
}

export default ChatPage
