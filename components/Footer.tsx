import Link from 'next/link'
import styles from '@/styles/footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.linkWrapper}>
        <div className={styles.links}>
          <h4>Discover</h4>
          <Link href="/" passHref>
            <a>Home</a>
          </Link>
          <Link href="/courses" passHref>
            <a>Courses</a>
          </Link>
          <Link href="/events" passHref>
            <a>Events</a>
          </Link>
          <Link href="/organizations" passHref>
            <a>Organizations</a>
          </Link>
        </div>
        <div className={styles.links}>
          <h4>Elsewhere</h4>
          <Link href="/about" passHref>
            <a>Made by</a>
          </Link>
          <Link href="/disclaimers" passHref>
            <a>Disclaimers</a>
          </Link>
        </div>
        <div className={styles.links}>
          <h4>Powered By</h4>
          <li>🧠, ☕️, ❤️</li>
        </div>
      </div>
    </footer>
  )
}
