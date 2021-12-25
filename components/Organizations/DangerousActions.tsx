import * as React from 'react'
import { useState } from 'react'
import DeleteOrganization from './DeleteOrganization'
import RemoveAdminForm from './RemoveAdminForm'
import TransferOwnerForm from './TransferOwnerForm'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import formstyles from '@/styles/form.module.css'

export default function DangerousActions({ organizationId, organizationName }) {
  const allTabs = [
    {
      icon: '🍅',
      label: 'Remove Admin',
      id: 'removeAdmin',
      component: <RemoveAdminForm organizationId={organizationId} />,
    },
    {
      icon: '🥬',
      label: 'Transfer Owner',
      id: 'transferOwner',
      component: <TransferOwnerForm organizationId={organizationId} />,
    },
    {
      icon: '🧀',
      label: 'Delete Organization',
      id: 'deleteOrganization',
      component: (
        <DeleteOrganization
          organizationId={organizationId}
          organizationName={organizationName}
        />
      ),
    },
  ]

  const [removeAdmin, transferOwner, deleteOrganization] = allTabs
  const initialTabs = [removeAdmin, transferOwner, deleteOrganization]
  const [selectedTab, setSelectedTab] = useState(initialTabs[0])
  return (
    <div>
      <nav>
        <div className={formstyles.tabs}>
          {initialTabs.map((item) => (
            <motion.button
              key={item.label}
              className={
                item.id === selectedTab.id
                  ? `${formstyles.active} ${formstyles.tab}`
                  : ` ${formstyles.tab}`
              }
              onClick={() => setSelectedTab(item)}
            >
              {item.label}
              {item.id === selectedTab.id ? (
                <motion.div
                  className={formstyles.underline}
                  layoutId="actions"
                />
              ) : null}
            </motion.button>
          ))}
        </div>
      </nav>
      <section>
        <AnimatePresence exitBeforeEnter>
          <motion.div
            key={selectedTab ? selectedTab.label : 'empty'}
            animate={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -5 }}
            exit={{ opacity: 0, x: 5 }}
            transition={{ duration: 0.15 }}
          >
            {selectedTab ? selectedTab.component : 'Nothing to see here 😋.'}
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  )
}
