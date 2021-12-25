import Link from 'next/link'
import styles from '@/styles/footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.linkWrapper}>
        <div className={styles.links}>
          <Link href="/" passHref>
            <a>Home</a>
          </Link>
          <Link href="/" passHref>
            <a>Courses</a>
          </Link>
          <Link href="/" passHref>
            <a>Events</a>
          </Link>
          <Link href="/" passHref>
            <a>Organizations</a>
          </Link>
        </div>
        <div className={styles.links}>
          <Link href="/about" passHref>
            <a>Made by</a>
          </Link>
          <Link href="/disclaimers" passHref>
            <a>Disclaimers</a>
          </Link>
        </div>
      </div>
    </footer>
  )
}
