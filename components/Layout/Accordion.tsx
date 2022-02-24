import { useState } from 'react'
import styles from '@/styles/layout.module.css'
import { PlusIcon } from '@/components/Icons'
import { motion, AnimatePresence } from 'framer-motion'

export default function Accordion({ heading, children }) {
  const headingAnim = {
    closed: {
      height: '0',
      transition: {
        when: 'afterChildren',
        // ease: [0.04, 0.62, 0.23, 0.98],
      },
    },
    open: {
      height: '100%',
      transition: {
        // when: 'beforeChildren',
        // ease: 'easeInOut',
        // duration: 0.1,
      },
    },
  }

  const childrenAnim = {
    closed: {
      opacity: 0,
      // transition: {
      //   delay: 0,
      // },
    },
    open: {
      opacity: 1,
      // transition: {
      //   delay: 0,
      // },
    },
  }

  const buttonAnim = {
    closed: {
      rotate: 0,
      transition: {
        // type: 'tween',
        // duration: 0.05,
      },
    },
    open: {
      rotate: 45,
      transition: {
        // type: 'tween',
        // duration: 0.05,
      },
    },
  }
  const [isOpen, setIsOpen] = useState(false)
  return (
    <motion.section>
      <motion.div
        className={styles.header}
        key="heading"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2>{heading}</h2>
        <motion.button
          initial="closed"
          variants={buttonAnim}
          animate={isOpen ? 'open' : 'closed'}
          className={styles.primary}
        >
          <PlusIcon />
        </motion.button>
      </motion.div>
      <AnimatePresence exitBeforeEnter>
        {isOpen && (
          <motion.div
            animate={open ? 'open' : 'closed'}
            variants={headingAnim}
            exit="closed"
            initial="closed"
          >
            <motion.div
              key="children"
              variants={childrenAnim}
              layout="position"
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}
