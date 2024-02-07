'use client'

import { useCallback, useContext, useState } from 'react'
import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import { Avatar, Flex, Heading, IconButton, Select, Tooltip } from '@radix-ui/themes'
import cs from 'classnames'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { FaAdjust, FaGithub, FaMoon, FaRegSun } from 'react-icons/fa'
import { SiOracle } from 'react-icons/si'
import { IoSettingsSharp } from 'react-icons/io5'
import { Link } from './Link'
import { useTheme } from './Themes'
import ChatContext from './Chat/chatContext'

export interface HeaderProps {
  children?: React.ReactNode
  gitHubLink?: string
  ghost?: boolean
}

export const Header = ({ children, gitHubLink, ghost }: HeaderProps) => {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [show, setShow] = useState(false)

  const toggleNavBar = useCallback(() => {
    setShow((state) => !state)
  }, [])

  const { openClusterSettingsModal } =
    useContext(ChatContext)

  return (
    <header
      className={cs('block shadow-sm sticky top-0 dark:shadow-gray-500 py-3 px-4 z-20')}
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      <Flex align="center" gap="3">
        <NextLink href="/">
          <Flex gap="1">
            <SiOracle className="size-6" color="red" />
            <Heading as="h2" size="3" style={{ maxWidth: 200 }}>
              Oracle OpenSearch
            </Heading>
          </Flex>
        </NextLink>
        <Flex align="center" gap="3" className="ml-auto">
          <Tooltip content="Cluster Settings">
            <IconButton
              size="3"
              variant="ghost"
              color="gray"
              onClick={openClusterSettingsModal}
            >
              <IoSettingsSharp width="32" height="32" />
            </IconButton>
          </Tooltip>
          <Select.Root value={theme} onValueChange={setTheme}>
            <Select.Trigger radius="full" />
            <Select.Content>
              <Select.Item value="light">
                <FaRegSun />
              </Select.Item>
              <Select.Item value="dark">
                <FaMoon />
              </Select.Item>
              <Select.Item value="system">
                <FaAdjust />
              </Select.Item>
            </Select.Content>
          </Select.Root>
        </Flex>
      </Flex>
    </header>
  )
}
