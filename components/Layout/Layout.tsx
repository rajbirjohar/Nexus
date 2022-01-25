import styles from '@/styles/layout.module.css'
import { motion, AnimatePresence } from 'framer-motion'
import Page from './Page'

interface Props {
  children: React.ReactNode | React.ReactNode[]
}

export default function Layout({ children }: Props) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      layout="position"
      className={styles.layout}
    >
      {children}
    </motion.main>
  )
}
