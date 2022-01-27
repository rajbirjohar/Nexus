import styles from '@/styles/layout.module.css'

// Component: Layout({children})
// Params: children
// Purpose: To wrap all pages within a consistent main html tag
// in order to ensure that every page has the same width, padding, margin

export default function HeroLayout({ children }) {
  return <main className={styles.herolayout}>{children}</main>
}
