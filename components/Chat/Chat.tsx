'use client'

import {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import { Flex, Heading, IconButton, ScrollArea, Tooltip } from '@radix-ui/themes'
import clipboard from 'clipboard'
import ContentEditable from 'react-contenteditable'
import toast from 'react-hot-toast'
import { AiOutlineClear, AiOutlineLoading3Quarters, AiOutlineUnorderedList } from 'react-icons/ai'
import { FiSend } from 'react-icons/fi'
import ChatContext from './chatContext'
import { ChatMessage, ClusterSettings, OpenSearchInteraction } from './interface'
import Message from './Message'
import * as OpenSearchUtils from '../../utils/opensearchUtils'

import './index.scss'

const HTML_REGULAR =
  /<(?!img|table|\/table|thead|\/thead|tbody|\/tbody|tr|\/tr|td|\/td|th|\/th|br|\/br).*?>/gi

export interface ChatGPInstance {
  setConversation: (messages: ChatMessage[]) => void
  getConversation: () => ChatMessage[]
  focus: () => void
}

const createConversation = async (clusterSettings: ClusterSettings, input: string) => {
  const json = await OpenSearchUtils.createConversation(clusterSettings, input);
  return json.conversation_id;
}

// const postChatOrQuestion = async (chat: Chat, messages: any[], input: string) => {
//   const url = '/api/chat'

//   const data = {
//     id: chat.id,
//     prompt: chat?.persona?.prompt,
//     messages: [...messages!],
//     input
//   }

//   return await fetch(url, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(data)
//   })
// }

const postQuery = async (clusterSettings: ClusterSettings, conversationId: string, input: string) => {
  const json = await OpenSearchUtils.searchRAG(clusterSettings, {
    input,
    conversationId,
    model: process.env.NEXT_PUBLIC_RAG_OPENSEARCH_MODEL_NAME!,
    indexName: process.env.NEXT_PUBLIC_RAG_OPENSEARCH_INDEX_NAME!,
    pipelineName: process.env.NEXT_PUBLIC_RAG_OPENSEARCH_PIPELINE_NAME!,
    prompt: ""
  });

  return {
    searchResults: json.hits.hits.map((result: any, id: number) => ({
      id,
      text: result._source.text,
      score: result._score
    })),
    answer: json.ext.retrieval_augmented_generation.answer
  };
}

const Chat = () => {
  const { debug, currentChat, clusterSettings, setCurrentChat, onToggleSearchResultsPane, onLastSearchChange, onCreateChat } =
    useContext(ChatContext)

  const [isLoading, setIsLoading] = useState(false)

  const [input, setInput] = useState('')

  const textAreaRef = useRef<HTMLElement>(null)

  const bottomOfChatRef = useRef<HTMLDivElement>(null)

  const sendMessage = useCallback(async (e: any) => {
    if (!isLoading) {
      e.preventDefault();

      console.log("Input : " + input);

      if (!input) {
        toast.error('Please type a valid message to continue.')
        return
      }

      currentChat!.messages = [...currentChat!.messages!, { content: input, role: 'user' }]
      setInput('')
      setIsLoading(true)
      onLastSearchChange?.([])
      try {

        if (!currentChat!.conversationId) {
          currentChat!.conversationId = await createConversation(clusterSettings!, input);
          currentChat!.name = input;
          onCreateChat?.(currentChat!)
          setCurrentChat?.(currentChat!)
        }

        const response = await postQuery(clusterSettings!, currentChat!.conversationId!, input)

        currentChat!.messages = [...currentChat!.messages!, { content: response.answer, role: 'assistant' }]

        onLastSearchChange?.(response.searchResults)

        setIsLoading(false)
      } catch (error: any) {
        toast.error(error.message || "An Unknown Error occurred while posting the query")
        setIsLoading(false)
        throw error
      }
      finally {
        setIsLoading(false);
      }
    }
  },
    [input, currentChat, isLoading, debug])

  const handleKeypress = useCallback(
    (e: any) => {
      if (e.keyCode == 13 && !e.shiftKey) {
        sendMessage(e)
        e.preventDefault()
      }
    },
    [sendMessage]
  )

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = '50px'
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight + 2}px`
    }
  }, [input, textAreaRef])

  useEffect(() => {
    if (bottomOfChatRef.current) {
      bottomOfChatRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [currentChat!.messages, input])

  useEffect(() => {
    if (!isLoading) {
      textAreaRef.current?.focus()
    }
  }, [isLoading])

  useEffect(() => {
    new clipboard('.copy-btn').on('success', () => { })
  }, [])

  async function loadAllInteractions() {
    const max_results = 100;
    let next_token = 0;
    setIsLoading(true);
    try {
      do {
        const response = await OpenSearchUtils.getInteractions(clusterSettings!, currentChat!.conversationId!, max_results, next_token);

        const interactions = response.interactions;

        if (interactions.length > 0) {
          const messages: ChatMessage[] = [];
          interactions.forEach((interaction: OpenSearchInteraction) => {
            messages.push({ content: interaction.response, role: 'assistant' })
            messages.push({ content: interaction.input, role: 'user' })
          })

          messages.reverse();

          currentChat!.messages = [...messages, ...currentChat!.messages];

          setCurrentChat?.(currentChat!)

          next_token += interactions.length;
        }
        else {
          next_token = -1;
        }

        setIsLoading(false);
      }
      while (next_token != -1);
    }
    catch (error: any) {
      toast.error(error.message || "An Unknown Error occurred while loading interactions")
      throw error
    }
    finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (currentChat!.messages.length <= 0 && currentChat!.conversationId) {
      loadAllInteractions();
    }
  }, [currentChat])

  return (
    <Flex direction="column" height="100%" className="relative" gap="3" style={{ 'borderRight': '3px solid var(--gray-a4)' }}>
      <Flex
        justify="between"
        align="center"
        py="3"
        px="4"
        style={{ backgroundColor: 'var(--gray-a2)' }}
      >
        <Heading size="4">{currentChat?.name || 'New chat'}</Heading>
        <Tooltip content="Toggle search results pane">
          <IconButton
            variant="soft"
            color="gray"
            size="2"
            className="rounded-xl"
            onClick={onToggleSearchResultsPane}
          >
            <AiOutlineUnorderedList className="h-4 w-4" />
          </IconButton>
        </Tooltip>
      </Flex>
      <ScrollArea
        className="flex-1 px-4"
        type="auto"
        scrollbars="vertical"
        style={{ height: '100%' }}
      >
        {currentChat!.messages.map((item, index) => (
          <Message key={index} message={item} />
        ))}
        <div ref={bottomOfChatRef}></div>
      </ScrollArea>
      <div className="px-4 pb-3">
        <Flex align="end" justify="between" gap="3" className="relative">
          <div className="rt-TextAreaRoot rt-r-size-1 rt-variant-surface flex-1 rounded-3xl chat-textarea">
            <ContentEditable
              innerRef={textAreaRef}
              style={{
                minHeight: '24px',
                maxHeight: '200px',
                overflowY: 'auto'
              }}
              className="rt-TextAreaInput text-base"
              html={input}
              disabled={isLoading}
              onChange={(e) => {
                setInput(e.target.value.replace(HTML_REGULAR, ''));
              }}
              onKeyDown={(e) => {
                handleKeypress(e)
              }}
              placeholder="Enter a prompt here"
            />
            <div className="rt-TextAreaChrome"></div>
          </div>
          <Flex gap="3" className="absolute right-0 pr-4 bottom-2 pt">
            {isLoading && (
              <Flex
                width="6"
                height="6"
                align="center"
                justify="center"
                style={{ color: 'var(--accent-11)' }}
              >
                <AiOutlineLoading3Quarters className="animate-spin h-4 w-4" />
              </Flex>
            )}
            <IconButton
              variant="soft"
              disabled={isLoading}
              color="gray"
              size="2"
              className="rounded-xl"
              onClick={sendMessage}
            >
              <FiSend className="h-4 w-4" />
            </IconButton>
          </Flex>
        </Flex>
      </div>
    </Flex>
  )
}

export default Chat


