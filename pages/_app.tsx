import type { AppProps } from 'next/app'
import NextNProgress from 'nextjs-progressbar'
import Header from '@/components/Layout/Navigation/Header'
import Footer from '@/components/Layout/Footer'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'react-hot-toast'

import '../styles/globals.css'

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider defaultTheme="system" disableTransitionOnChange={true}>
        <NextNProgress
          color="var(--teal-500)"
          startPosition={0.3}
          stopDelayMs={200}
          height={3}
          showOnShallow={false}
          options={{ easing: 'ease', speed: 500, showSpinner: false }}
        />
        <Toaster
          toastOptions={{
            success: {
              style: {
                background: 'var(--gray-50)',
                color: 'var(--teal-800)',
              },
            },
            error: {
              style: {
                background: 'var(--gray-50)',
                color: 'var(--rose-800)',
              },
            },
          }}
        />
        <Header />
        <Component {...pageProps} />
        <Footer />
      </ThemeProvider>
    </SessionProvider>
  )
}

export default App
