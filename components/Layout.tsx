import styles from '@/styles/layout.module.css'

export default function Layout({ children }) {
  return <main className={styles.layout}>{children}</main>
}
