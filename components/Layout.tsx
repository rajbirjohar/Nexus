import styles from '@/styles/layout.module.css'
import { motion } from 'framer-motion'

// Component: Layout({children})
// Params: children
// Purpose: To wrap all pages within a consistent main html tag
// in order to ensure that every page has the same width, padding, margin

export default function Layout({ children }) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={styles.layout}
    >
      {children}
    </motion.main>
  )
}
