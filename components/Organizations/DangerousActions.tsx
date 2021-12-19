import React, { useState } from 'react'
import DeleteOrganization from './DeleteOrganization'
import RemoveAdminForm from './RemoveAdminForm'
import TransferOwnerForm from './TransferOwnerForm'
import styles from '@/styles/form.module.css'

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
  const buttons = tabs.map((item) => (
    <button
      onClick={() => setVisibleTab(item.id)}
      className={
        visibleTab === item.id
          ? `${styles.active} ${styles.tab}`
          : `${styles.tab}`
      }
    >
      {item.tabTitle}
    </button>
  ))
  const content = tabs.map((item) => (
    <div style={visibleTab === item.id ? {} : { display: 'none' }}>
      {item.tabContent}
    </div>
  ))
  return (
    <>
      <div className={styles.tabs}>{buttons}</div>
      {content}
    </>
  )
}
