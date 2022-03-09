import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import ThemeChanger from '../../Theme'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useScrollBlock } from 'hooks/useScrollBlock'
import { motion, AnimatePresence } from 'framer-motion'
import { MenuButton } from './MenuButton'
import styles from '@/styles/header.module.css'
import formstyles from '@/styles/form.module.css'
import Image from 'next/image'
import logo from 'public/NexusLogo.svg'

const list = {
  closed: {
    opacity: 0,
    transition: {
      type: 'tween',
      staggerChildren: 0.05,
    },
  },
  open: {
    opacity: 1,
    transition: {
      type: 'tween',
      staggerChildren: 0.1,
    },
  },
}

const listItem = {
  closed: {
    opacity: 0,
    x: -5,
    transition: {
      type: 'tween',
    },
  },
  open: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'tween',
    },
  },
}

const NavLink = ({ title, path, setIsOpen, isOpen }) => {
  const [blockScroll, allowScroll] = useScrollBlock()

  const openNav = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      blockScroll()
    } else {
      allowScroll()
    }
  }

  return (
    <motion.li variants={listItem} onClick={openNav}>
      <Link href={path}>{title}</Link>
    </motion.li>
  )
}

export default function MobileHeader() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [scroll, setScroll] = useState(false)
  useEffect(() => {
    window.addEventListener('scroll', () => {
      setScroll(window.scrollY > 10)
    })
  })

  return (
    <nav
      className={
        scroll ? `${styles.mobilenav} ${styles.shadow}` : `${styles.mobilenav}`
      }
    >
      <div className={styles.innernav}>
        <Link href="/">
          <a className={styles.mobilelogo}>
            <Image src={logo} alt="Nexus Logo" width={30} height={30} />
          </a>
        </Link>
        <MenuButton
          isOpen={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          strokeWidth="4"
          color="var(--gray-900)"
          lineProps={{ strokeLinecap: 'round' }}
          transition={{ type: 'tween', duration: 0.4 }}
          width="24"
          height="15"
          className={styles.hamburger}
        />
        <AnimatePresence>
          {isOpen && (
            <motion.ul
              className={styles.mobilenavlist}
              variants={list}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <NavLink
                title="Home"
                path="/"
                setIsOpen={setIsOpen}
                isOpen={isOpen}
              />
              <NavLink
                title="Courses"
                path="/courses"
                setIsOpen={setIsOpen}
                isOpen={isOpen}
              />
              <NavLink
                title="Events"
                path="/events"
                setIsOpen={setIsOpen}
                isOpen={isOpen}
              />
              <NavLink
                title="Organizations"
                path="/organizations"
                setIsOpen={setIsOpen}
                isOpen={isOpen}
              />
              <NavLink
                title="Opportunities"
                path="/opportunities"
                setIsOpen={setIsOpen}
                isOpen={isOpen}
              />
              {session ? (
                <>
                  <NavLink
                    title="Profile"
                    path="/profile"
                    setIsOpen={setIsOpen}
                    isOpen={isOpen}
                  />
                  <motion.li variants={listItem}>
                    <button onClick={() => signOut()}>Sign out</button>
                  </motion.li>
                </>
              ) : (
                <motion.li variants={listItem}>
                  <button
                    className={formstyles.primary}
                    onClick={() => signIn('google')}
                  >
                    Sign in
                  </button>
                </motion.li>
              )}
              <motion.li variants={listItem}>
                <ThemeChanger />
              </motion.li>
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
