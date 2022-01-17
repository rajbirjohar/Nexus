import React, { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import ThemeChanger from '@/components/Theme'
import { useWindowSize } from 'hooks/useWindowSize'
import styles from '@/styles/header.module.css'
import formstyles from '@/styles/form.module.css'
import MobileHeader from './MobileHeader'

// Component: Header
// Params: none
// Purpose: To render the navigation bar, both on desktop and mobile screens
// When editing, ensure to update both nav bars with the same links

// Determines the size of the window using the useWindowSize hook

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
      {/* If the window width is greater than 868 pixels,
      display the desktop navigation bar */}
      {size.width > 668 ? (
        <nav
          className={
            scroll ? `${styles.nav} ${styles.shadow}` : `${styles.nav}`
          }
        >
          <div className={styles.innernav}>
            <ThemeChanger />
            <ul className={styles.navlist}>
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
        <MobileHeader />
        // <nav
        //   className={
        //     scroll
        //       ? `${styles.mobilenavigation} ${styles.mobileshadow}`
        //       : `${styles.mobilenavigation}`
        //   }
        // >
        //   <div className={styles.hamburger} onClick={() => setOpen(!open)}>
        //     <span
        //       className={
        //         open ? `${styles.inner} ${styles.onclick}` : `${styles.inner}`
        //       }
        //     ></span>
        //     <span
        //       className={
        //         open ? `${styles.inner} ${styles.onclick2}` : `${styles.inner}`
        //       }
        //     ></span>
        //   </div>
        //   <AnimatePresence exitBeforeEnter>
        //     <motion.ul
        //       animate={open ? 'open' : 'closed'}
        //       variants={list}
        //       exit="closed"
        //       initial={false}
        //       className={styles.notopen}
        //     >
        //       <MobileLink
        //         path="/"
        //         title="Home"
        //         onClick={() => setOpen(!open)}
        //       />
        //       <MobileLink
        //         path="/courses"
        //         title="Courses"
        //         onClick={() => setOpen(!open)}
        //       />
        //       <MobileLink
        //         path="/events"
        //         title="Events"
        //         onClick={() => setOpen(!open)}
        //       />
        //       <MobileLink
        //         path="/organizations"
        //         title="Organizations"
        //         onClick={() => setOpen(!open)}
        //       />

        //       {session ? (
        //         <>
        //           <MobileLink
        //             path="/profile"
        //             title="Profile"
        //             onClick={() => setOpen(!open)}
        //           />
        //           <motion.button
        //             variants={listItems}
        //             className={styles.logout}
        //             onClick={() =>
        //               signOut({
        //                 callbackUrl: `${window.location.origin}`,
        //               })
        //             }
        //           >
        //             Sign out
        //           </motion.button>
        //         </>
        //       ) : (
        //         <motion.button
        //           variants={listItems}
        //           className={formstyles.primarylogin}
        //           onClick={() =>
        //             signIn('google', {
        //               callbackUrl: `${window.location.origin}/profile`,
        //             })
        //           }
        //         >
        //           Sign in
        //         </motion.button>
        //       )}
        //       <motion.li variants={listItems}>
        //         <ThemeChanger />
        //       </motion.li>
        //     </motion.ul>
        //   </AnimatePresence>
        // </nav>
      )}
    </>
  )
}
