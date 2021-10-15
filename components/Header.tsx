import { useSession, signIn, signOut } from 'next-auth/react'
import ThemeChanger from '@/components/Theme'
import styles from '@/styles/header.module.css'

export default function Header() {
  const { data: session } = useSession()

  return (
    <nav className={styles.navigation}>
      <ThemeChanger />
      <ul className={styles.linkwrapper}>
        {session ? (
          <li>
            <button
              className={styles.secondary}
              onClick={() =>
                signOut({
                  callbackUrl: `${window.location.origin}`,
                })
              }
            >
              Sign out
            </button>
          </li>
        ) : (
          <li>
            <button
              className={styles.primary}
              onClick={() =>
                signIn('google', {
                  callbackUrl: `${window.location.origin}/profile`,
                })
              }
            >
              Sign in
            </button>
          </li>
        )}
      </ul>
    </nav>
  )
}
