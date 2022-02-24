import { useState } from 'react'
import { DotsIcon } from '../Icons'
import styles from '@/styles/layout.module.css'
import useDropdownMenu from 'react-accessible-dropdown-menu-hook'

export default function Dropdown({ children }) {
  const { buttonProps, itemProps, isOpen } = useDropdownMenu(3)

  return (
    <div className={styles.dropdown}>
      <button className={styles.dropdownbutton} {...buttonProps}>
        <DotsIcon />
      </button>
      <nav className={isOpen ? `${styles.visible}` : `${styles.hidden}`}>
        {children}
      </nav>
    </div>
  )
}
