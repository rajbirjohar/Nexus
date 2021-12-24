import * as React from 'react'
import { useState } from 'react'
import DeleteOrganization from './DeleteOrganization'
import RemoveAdminForm from './RemoveAdminForm'
import TransferOwnerForm from './TransferOwnerForm'
import { motion, AnimatePresence } from 'framer-motion'
import formstyles from '@/styles/form.module.css'

export default function DangerousActions({ organizationId, organizationName }) {
  const allIngredients = [
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

  const [removeAdmin, transferOwner, deleteOrganization] = allIngredients
  const initialTabs = [removeAdmin, transferOwner, deleteOrganization]
  const [selectedTab, setSelectedTab] = useState(initialTabs[0])
  return (
    <div className="window">
      <nav>
        <div className={formstyles.tabs}>
          {initialTabs.map((item) => (
            <button
              key={item.label}
              className={
                item.id === selectedTab.id
                  ? `${formstyles.active} ${formstyles.tab}`
                  : ` ${formstyles.tab}`
              }
              onClick={() => setSelectedTab(item)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>
      <main>
        <AnimatePresence exitBeforeEnter>
          <motion.div
            key={selectedTab ? selectedTab.label : 'empty'}
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {selectedTab ? selectedTab.component : '😋'}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
