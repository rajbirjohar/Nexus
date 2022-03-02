import Link from 'next/link'
import Image from 'next/image'
import styles from '@/styles/footer.module.css'
import logo from 'public/NexusLogo.svg'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.innerfooter}>
        <div className={styles.linkwrapper}>
          <Link href="/">
            <a className={styles.logo}>
              <Image src={logo} alt="Nexus Logo" width={30} height={30} />
              <span>Nexus</span>
            </a>
          </Link>
          <div className={styles.discover}>
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
              <Link href="/opportunities" passHref>
                <a>Opportunities</a>
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
          </div>
        </div>
        <span className={styles.ending}>Written with 💻, ☕️, 🧠, and ❤️</span>
      </div>
    </footer>
  )
}
