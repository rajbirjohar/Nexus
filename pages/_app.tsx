import type { AppProps } from 'next/app'

import Header from '@/components/Header'
import Footer from '@/components/Footer'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'

import '../styles/globals.css'

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider defaultTheme="system">
        <Header />
        <Component {...pageProps} />
        <Footer />
      </ThemeProvider>
    </SessionProvider>
  )
}

export default App
