import Link from 'next/link'
import styles from '@/styles/footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Link href="/about" passHref>
        <a>Made by five students.</a>
      </Link>
    </footer>
  )
}
