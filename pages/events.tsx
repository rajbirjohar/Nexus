import React, { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import ListAllEvents from '@/components/Events/ListAllEvents'
import Layout from '@/components/Layout'
import styles from '@/styles/events.module.css'
import formstyles from '@/styles/form.module.css'
import ListUserEvents from '@/components/Events/ListUserEvents'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'

export default function EventsPage() {
  const { data: session } = useSession()
  const allTabs = [
    {
      icon: '🍅',
      label: 'All Events',
      id: 'allevents',
      component: <ListAllEvents />,
    },
    {
      icon: '🥬',
      label: 'Member Events',
      id: 'memberevents',
      component: <ListUserEvents />,
    },
  ]
  const [allevents, memberevents] = allTabs
  const initialTabs = [allevents, memberevents]
  const [selectedTab, setSelectedTab] = useState(initialTabs[0])

  return (
    <Layout>
      <Head>
        <title>Nexus | Events</title>
      </Head>
      <section>
        <div className={styles.hero}>
          <div className={styles.content}>
            <h1>Events</h1>
            <p>
              This is where you&#39;ll be able to see all of the ongoing and
              future events of our clubs and organizations. Events are sorted by
              the date and time that they end.
            </p>
          </div>
        </div>

        {session && (
          <>
            <LayoutGroup>
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
                        layoutId="events"
                      />
                    ) : null}
                  </motion.button>
                ))}
              </div>
            </LayoutGroup>
            <section>
              <AnimatePresence exitBeforeEnter>
                <motion.div
                  key={selectedTab ? selectedTab.label : 'empty'}
                  animate={{ opacity: 1, x: 0 }}
                  initial={{ opacity: 0, x: -5 }}
                  exit={{ opacity: 0, x: 5 }}
                  transition={{ duration: 0.15 }}
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
      </section>
    </Layout>
  )
}
