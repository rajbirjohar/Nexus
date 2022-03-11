import React, { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import ThemeChanger from '@/components/Theme'
import { useWindowSize } from 'hooks/useWindowSize'
import styles from '@/styles/header.module.css'
import formstyles from '@/styles/form.module.css'
import MobileHeader from './MobileHeader'
import Image from 'next/image'
import logo from 'public/NexusLogo.svg'

interface Size {
  width: number | undefined
  height: number | undefined
}

export default function Header() {
  const { data: session } = useSession()
  const size: Size = useWindowSize()
  const [scroll, setScroll] = useState(false)
  useEffect(() => {
    window.addEventListener('scroll', () => {
      setScroll(window.scrollY > 10)
    })
  }, [])

  return (
    <>
      {size.width > 826 ? (
        <nav
          className={
            scroll ? `${styles.nav} ${styles.shadow}` : `${styles.nav}`
          }
        >
          <div className={styles.innernav}>
            <Link href="/">
              <a className={styles.logo}>
                <Image
                  src={logo}
                  alt="Nexus Logo"
                  width={30}
                  height={30}
                  className={styles.navlogo}
                />
                <span>Nexus</span>
              </a>
            </Link>
            <ul className={styles.navlist}>
              <Link href="/">Home</Link>
              <Link href="/courses">Courses</Link>
              <Link href="/events">Events</Link>
              <Link href="/organizations">Organizations</Link>
              <Link href="/opportunities">Opportunities</Link>
              {session ? (
                <>
                  <Link href="/profile">Profile</Link>
                  <li>
                    <button onClick={() => signOut()}>Sign out</button>
                  </li>
                </>
              ) : (
                // Else display the mobile navigation bar
                <li>
                  <button
                    className={formstyles.primary}
                    onClick={() => signIn('google')}
                  >
                    Sign in
                  </button>
                </li>
              )}
              <ThemeChanger />
            </ul>
          </div>
        </nav>
      ) : (
        <MobileHeader />
      )}
    </>
  )
}
