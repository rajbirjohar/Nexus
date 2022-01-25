import React, { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import Layout from '@/components/Layout'
import ListUserPosts from '@/components/Profile/ListUserPosts'
import ListUserOrganizations from '@/components/Profile/ListUserOrganizations'
import ListNotifications from '@/components/Profile/ListNotifications'
import SetRoleForm from '@/components/Profile/SetRoleForm'
import styles from '@/styles/profile.module.css'
import formstyles from '@/styles/form.module.css'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'

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
  const allTabs = [
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
  ]
  const [organizations, reviews] = allTabs
  const initialTabs = [organizations, reviews]
  const [selectedTab, setSelectedTab] = useState(initialTabs[0])

  return (
    <Layout>
      <Head>
        <title>Nexus | Profile</title>
        <link rel="icon" href="/NexusLogo.svg" />
      </Head>
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
          <LayoutGroup>
            <ListNotifications />
          </LayoutGroup>
          <LayoutGroup>
            <nav className={formstyles.tabs}>
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
                      layoutId="profile"
                    />
                  ) : null}
                </motion.button>
              ))}
            </nav>
          </LayoutGroup>
          <section>
            <AnimatePresence exitBeforeEnter>
              <motion.div
                key={selectedTab ? selectedTab.label : 'empty'}
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, type: 'tween' }}
              >
                <h2>{selectedTab.label}</h2>
                {selectedTab
                  ? selectedTab.component
                  : 'Nothing to see here 😋.'}
              </motion.div>
            </AnimatePresence>
          </section>
        </>
      )}
    </Layout>
  )
}
