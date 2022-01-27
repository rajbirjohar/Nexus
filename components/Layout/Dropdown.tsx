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
        duration: 0.2,
        ease: 'easeOut',
        type: 'tween',
      },
    },
    open: {
      height: 'auto',
      transition: {
        when: 'beforeChildren',
        duration: 0.1,
        ease: 'easeIn',
        type: 'tween',
      },
    },
  }

  const childrenAnim = {
    closed: {
      opacity: 0,
    },
    open: {
      opacity: 1,
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
    <section>
      <div className={formstyles.heading} onClick={() => setIsOpen(!isOpen)}>
        <h2>{heading} </h2>
        <button className={formstyles.revealprimary}>
          <PlusIcon />
        </button>
      </div>
      {isOpen && children}
    </section>
  )
}

export default Dropdown
