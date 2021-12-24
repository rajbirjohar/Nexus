import React, { useState } from 'react'
import DeleteOrganization from './DeleteOrganization'
import RemoveAdminForm from './RemoveAdminForm'
import TransferOwnerForm from './TransferOwnerForm'
import styles from '@/styles/form.module.css'
import { motion, AnimatePresence } from 'framer-motion'

const list = {
  closed: {
    opacity: 0,
    display: 'none',
    transition: {
      duration: 0.5,
    },
  },
  open: {
    opacity: 1,
    display: 'block',
    transition: {
      duration: 0.5,
    },
  },
}

const listItems = {
  closed: {
    opacity: 0,
  },
  open: {
    opacity: 1,
  },
}

export default function DangerousActions({ organizationId, organizationName }) {
  const tabs = [
    {
      id: 1,
      tabTitle: 'Remove Admin',
      tabContent: <RemoveAdminForm organizationId={organizationId} />,
    },
    {
      id: 2,
      tabTitle: 'Transfer Owner',
      tabContent: <TransferOwnerForm organizationId={organizationId} />,
    },
    {
      id: 3,
      tabTitle: 'Delete Organization',
      tabContent: (
        <DeleteOrganization
          organizationId={organizationId}
          organizationName={organizationName}
        />
      ),
    },
  ]
  const [visibleTab, setVisibleTab] = useState(tabs[0].id)

  return (
    <AnimatePresence exitBeforeEnter>
      <div className={styles.tabs}>
        {tabs.map((item) => (
          <button
            key={item.id}
            onClick={() => setVisibleTab(item.id)}
            className={
              visibleTab === item.id
                ? `${styles.active} ${styles.tab}`
                : `${styles.tab}`
            }
          >
            {item.tabTitle}
          </button>
        ))}
      </div>
      {tabs.map((item) => (
        <motion.div
          key={item.id}
          animate={visibleTab === item.id ? 'open' : 'closed'}
          variants={list}
          exit="closed"
          // style={visibleTab === item.id ? {} : { display: 'none' }}
        >
          <motion.div variants={listItems}>{item.tabContent}</motion.div>
        </motion.div>
      ))}
    </AnimatePresence>
  )
}
