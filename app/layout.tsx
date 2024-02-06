import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { Header } from '@/components/Header'
import ThemesProvider from '@/providers/ThemesProvider'
import '@/styles/globals.scss'
import '@/styles/theme-config.css'

export const metadata = {
  title: {
    default: 'Oracle OpenSearch',
    template: `%s - Oracle OpenSearch`
  },
  description: 'AI assistant powered by Oracle OpenSearch',
  icons: {
    icon: '/favicon-192.avif',
    shortcut: '/favicon-192.avif',
    apple: '/favicon-192.avif'
  }
}

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemesProvider>
          <Header />
          {children}
          <Toaster />
        </ThemesProvider>
      </body>
    </html>
  )
}
