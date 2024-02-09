'use client'

import React, { useContext } from 'react'
import { Box, Flex, IconButton, ScrollArea, Text, Tooltip } from '@radix-ui/themes'
import cs from 'classnames'
import { AiOutlineClear, AiOutlineCloseCircle } from 'react-icons/ai'
import { BiMessageDetail } from 'react-icons/bi'
import { FiPlus } from 'react-icons/fi'
import { RiRobot2Line } from 'react-icons/ri'
import ChatContext from './chatContext'

import './index.scss'

export const ChatSideBar = () => {
  const {
    currentChat,
    chatList,
    DefaultPersonas,
    toggleSidebar,
    onDeleteChat,
    onDeleteAllChat,
    onChangeChat,
    onStartChat,
  } = useContext(ChatContext)

  console.log(chatList);

  return (
    <Flex direction="column" className={cs('chart-side-bar', { show: toggleSidebar })}>
      <Flex className="pt-2 h-full overflow-hidden w-64" direction="column" gap="3">
        <Flex direction="row" gap="2">
          <Box
            onClick={() => onStartChat?.()}
            className="bg-token-surface-primary active:scale-95 w-4/5"
          >
            <FiPlus className="h-4 w-4" />
            <Text>Start Chat</Text>
          </Box>
          <Box
            onClick={() => onDeleteAllChat?.()}
            className="pt-1"
          >
            <Tooltip content="Delete all conversations">
              <IconButton
                variant="soft"
                color="red"
                size="2"
                className="rounded-xl"
              >
                <AiOutlineClear />
              </IconButton>
            </Tooltip>
          </Box>
        </Flex>
        <ScrollArea className="flex-1" type="auto" scrollbars="vertical">
          <Flex direction="column" gap="3">
            {chatList.map((chat) => (
              <Box
                key={chat.id}
                width="auto"
                className={cs('bg-token-surface active:scale-95 truncate', {
                  active: currentChat?.id === chat.id
                })}
                onClick={() => onChangeChat?.(chat)}
              >
                <Flex gap="2" align="center">
                  <BiMessageDetail className="h-4 w-4" />
                  <Text as="p" className="max-w-36 truncate hover:text-clip">
                    {chat.name}
                  </Text>
                </Flex>
                <IconButton
                  size="2"
                  variant="ghost"
                  color="gray"
                  radius="full"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteChat?.(chat)
                  }}
                >
                  <AiOutlineCloseCircle className="h-4 w-10" />
                </IconButton>
              </Box>
            ))}
          </Flex>
        </ScrollArea>
        {/* <Box
          width="auto"
          onClick={() => onOpenPersonaPanel?.('chat')}
          className="bg-token-surface-primary active:scale-95 "
        >
          <RiRobot2Line className="h-4 w-4" />
          <Text>Persona Store</Text>
        </Box> */}
      </Flex>
    </Flex>
  )
}

export default ChatSideBar
