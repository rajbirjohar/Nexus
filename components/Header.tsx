import React, { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import ThemeChanger from '@/components/Theme'
import { useWindowSize } from 'hooks/useWindowSize'
import styles from '@/styles/header.module.css'
import formstyles from '@/styles/form.module.css'
import { motion } from 'framer-motion'

// Component: Header
// Params: none
// Purpose: To render the navigation bar, both on desktop and mobile screens
// When editing, ensure to update both nav bars with the same links

// Determines the size of the window using the useWindowSize hook

interface Size {
  width: number | undefined
  height: number | undefined
}

const list = {
  closed: {
    opacity: 1,
    height: '0vh',
    transition: {
      duration: 0.0005,
    },
  },
  open: {
    opacity: 1,
    height: '100vh',
    transition: {
      duration: 0.0005,
      delayChildren: 0.05,
      staggerChildren: 0.05,
    },
  },
}

const listItems = {
  closed: {
    opacity: 0,
    x: -15,
  },
  open: {
    opacity: 1,
    x: 0,
  },
}

const MobileLink = ({ path, title, onClick }) => {
  return (
    <Link href={path} passHref>
      <motion.a variants={listItems} onClick={onClick}>
        {title}
      </motion.a>
    </Link>
  )
}

export default function Header() {
  const [open, setOpen] = useState(false)
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
      {/* If the window width is greater than 868 pixels,
      display the desktop navigation bar */}
      {size.width > 868 ? (
        <nav
          className={
            scroll
              ? `${styles.navigation} ${styles.shadow}`
              : `${styles.navigation}`
          }
        >
          <div className={styles.innernav}>
            <ThemeChanger />
            <ul className={styles.linkwrapper}>
              <Link href="/">Home</Link>
              <Link href="/courses">Courses</Link>
              <Link href="/events">Events</Link>
              <Link href="/organizations">Organizations</Link>
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
            </ul>
          </div>
        </nav>
      ) : (
        <nav
          className={
            scroll
              ? `${styles.mobilenavigation} ${styles.mobileshadow}`
              : `${styles.mobilenavigation}`
          }
        >
          <div className={styles.hamburger} onClick={() => setOpen(!open)}>
            <span
              className={
                open ? `${styles.inner} ${styles.onclick}` : `${styles.inner}`
              }
            ></span>
            <span
              className={
                open ? `${styles.inner} ${styles.onclick2}` : `${styles.inner}`
              }
            ></span>
          </div>
          <motion.ul
            animate={open ? 'open' : 'closed'}
            variants={list}
            className={styles.notopen}
          >
            <MobileLink path="/" title="Home" onClick={() => setOpen(!open)} />
            <MobileLink
              path="/courses"
              title="Courses"
              onClick={() => setOpen(!open)}
            />
            <MobileLink
              path="/events"
              title="Events"
              onClick={() => setOpen(!open)}
            />
            <MobileLink
              path="/organizations"
              title="Organizations"
              onClick={() => setOpen(!open)}
            />

            {session ? (
              <>
                <MobileLink
                  path="/profile"
                  title="Profile"
                  onClick={() => setOpen(!open)}
                />
                <motion.button
                  variants={listItems}
                  onClick={() =>
                    signOut({
                      callbackUrl: `${window.location.origin}`,
                    })
                  }
                >
                  Sign out
                </motion.button>
              </>
            ) : (
              <motion.button
                variants={listItems}
                className={formstyles.primarylogin}
                onClick={() =>
                  signIn('google', {
                    callbackUrl: `${window.location.origin}/profile`,
                  })
                }
              >
                Sign in
              </motion.button>
            )}
            <motion.li variants={listItems}>
              <ThemeChanger />
            </motion.li>
          </motion.ul>
        </nav>
      )}
    </>
  )
}
