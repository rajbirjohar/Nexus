import styles from '@/styles/card.module.css'
import { motion } from 'framer-motion'

const list = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const listItems = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.15,
    },
  },
}

// Component: Loader
// Params: none
// Purpose: To display a static loading state element
// while the data is being fetched so the UX is not broken

const Skeleton = () => {
  return (
    <motion.div variants={listItems} className={styles.dummycard}>
      <p className={styles.dummydescription}></p>
      <p className={styles.dummydescription}></p>
      <p className={styles.dummydescription}></p>
      <span className={styles.dummyauthor}>
        <p className={styles.dummytitle}></p>
      </span>
    </motion.div>
  )
}

export default function Loader() {
  return (
    <motion.div variants={list} initial="hidden" animate="show">
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </motion.div>
  )
}
