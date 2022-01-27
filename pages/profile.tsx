import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import Page from '@/components/Layout/Page'
import ListUserPosts from '@/components/Profile/ListUserPosts'
import ListUserOrganizations from '@/components/Profile/ListUserOrganizations'
import ListNotifications from '@/components/Profile/ListNotifications'
import SetRoleForm from '@/components/Profile/SetRoleForm'
import styles from '@/styles/profile.module.css'
import Tabs from '@/components/Layout/Tabs'

export default function Profile() {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/')
      toast.error('Please sign in.')
      // User is not authenticated
    },
  })

  return (
    <Page title="Profile" tip={null}>
      {session && session.user.role && session.user.role.includes('none') && (
        <SetRoleForm userId={session.user.id} />
      )}
      <div className={styles.hero}>
        <div className={styles.content}>
          <h1>Profile</h1>
          {status === 'loading' && (
            <>
              <p>
                <strong>Loading your profile...</strong>
              </p>
            </>
          )}
          {session && (
            <>
              <p>
                <strong>Hello {session.user.name}!</strong>
              </p>
            </>
          )}
          <p>
            Here you can view all your posts and organizations in one place.
            Happy posting.
          </p>
        </div>
      </div>
      {session && (
        <>
          <ListNotifications />
          <Tabs
            tabs={[
              {
                label: 'Organizations',
                id: 'organizations',
                component: <ListUserOrganizations />,
              },
              {
                label: 'Reviews',
                id: 'reviews',
                component: <ListUserPosts />,
              },
            ]}
            layoutId="profile"
          />
        </>
      )}
    </Page>
  )
}
