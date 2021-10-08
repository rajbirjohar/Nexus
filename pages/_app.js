import '../styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'

import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <ThemeProvider defaultTheme="system">
      <SessionProvider session={session}>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </SessionProvider>
    </ThemeProvider>
  )
}
