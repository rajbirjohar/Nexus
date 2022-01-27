import styles from '@/styles/layout.module.css'
import { motion } from 'framer-motion'

interface Props {
  children: React.ReactNode | React.ReactNode[]
}

export default function Layout({ children }: Props) {
  return <main className={styles.layout}>{children}</main>
}
