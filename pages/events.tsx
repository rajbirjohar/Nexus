import React, { useState } from 'react'
import Head from 'next/head'
import { useSession } from 'next-auth/react'
import ListAllEvents from '@/components/Events/ListAllEvents'
import Layout from '@/components/Layout'
import styles from '@/styles/events.module.css'
import formstyles from '@/styles/form.module.css'
import ListUserEvents from '@/components/Events/ListUserEvents'
import { LottieWrapper } from '@/components/LottieWrapper'
import { GreenTip } from '@/components/Tips'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import animationData from '@/lotties/teamblue.json'

export default function EventsPage() {
  const { data: session } = useSession()
  const allTabs = [
    {
      label: 'All Events',
      id: 'allevents',
      component: <ListAllEvents />,
    },
    {
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
        <link rel="icon" href="/NexusLogo.svg" />
      </Head>
      <section>
        <div className={styles.hero}>
          <div className={styles.content}>
            <div className={styles.text}>
              <h1>Events</h1>
              <p>
                This is where you&#39;ll be able to see all of the ongoing and
                future events of our clubs and organizations. Events are sorted
                by the date and time they end. All organizations list all of
                their own events so be sure to check those out!
              </p>
              <GreenTip header="Join an Org">
                Events from organizations you join will be curated for you all
                in one place. You can view all the events that matter to you.
              </GreenTip>
            </div>
            <div className={styles.animationWrapper}>
              <LottieWrapper animationData={animationData} />
            </div>
          </div>
        </div>

        {session ? (
          <>
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
                        layoutId="events"
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
        ) : (
          <>
            <h2>All Events</h2>
            <ListAllEvents />
          </>
        )}
      </section>
    </Layout>
  )
}
