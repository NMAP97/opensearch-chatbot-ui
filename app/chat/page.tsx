'use client'

import { Flex } from '@radix-ui/themes'
import { Chat, ChatContext, ChatSideBar, PersonaPanel, useChatHook } from '@/components'
import PersonaModal from './PersonaModal'
import SearchResultsPane from '@/components/Chat/SearchResultsPane'

const ChatPage = () => {
  const provider = useChatHook()

  return (
    <ChatContext.Provider value={provider}>
      <Flex style={{ height: 'calc(100% - 56px)' }} className="relative">
        <ChatSideBar />
        <div className="flex-1 relative">
          <Chat />
          {/* <PersonaPanel /> */}
        </div>
        {/* <div className="flex-1 relative">
          <SearchResultsPane />
        </div> */}
      </Flex>
      {/* <PersonaModal /> */}
    </ChatContext.Provider>
  )
}

export default ChatPage
