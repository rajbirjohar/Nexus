import styles from '@/styles/layout.module.css'
import { motion } from 'framer-motion'

export default function Layout({ children }) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={styles.layout}
      layout
    >
      {children}
    </motion.main>
  )
}
