import Link from 'next/link'
import styles from '@/styles/footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.linkWrapper}>
        <Link href="/about" passHref>
          <a>Made by five students</a>
        </Link>
        <Link href="/disclaimers" passHref>
          <a>Some Really Important Information</a>
        </Link>
      </div>
    </footer>
  )
}
