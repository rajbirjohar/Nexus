import { useState } from 'react'
import formstyles from '@/styles/form.module.css'
import { PlusIcon } from '@/components/Icons'
import { motion, AnimatePresence } from 'framer-motion'

const Dropdown = ({ heading, children }) => {
  const headingAnim = {
    closed: {
      height: '0',
      transition: {
        when: 'afterChildren',
        duration: 0.3,
        ease: [0.04, 0.62, 0.23, 0.98],
      },
    },
    open: {
      height: 'auto',
      transition: {
        duration: 0.2,
        ease: [0.04, 0.62, 0.23, 0.98],
      },
    },
  }

  const childrenAnim = {
    closed: {
      opacity: 0,
      transition: {
        delay: 0,
        duration: 0.1,
      },
    },
    open: {
      opacity: 1,
      transition: {
        delay: 0,
        duration: 0.2,
      },
    },
  }

  const buttonAnim = {
    closed: {
      rotate: 0,
      transition: {
        type: 'tween',
        duration: 0.05,
      },
    },
    open: {
      rotate: 45,
      transition: {
        type: 'tween',
        duration: 0.05,
      },
    },
  }
  const [isOpen, setIsOpen] = useState(false)
  return (
    <motion.section>
      <motion.div
        className={formstyles.heading}
        key="heading"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2>{heading}</h2>
        <motion.button
          initial="closed"
          variants={buttonAnim}
          animate={isOpen ? 'open' : 'closed'}
          className={formstyles.revealprimary}
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

export default Dropdown
