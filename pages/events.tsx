import React, { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import ListAllEvents from '@/components/Events/ListAllEvents'
import Layout from '@/components/Layout'
import styles from '@/styles/events.module.css'
import formstyles from '@/styles/form.module.css'
import ListUserEvents from '@/components/Events/ListUserEvents'

export default function EventsPage() {
  const { data: session } = useSession()
  const [tab, setTab] = useState(0)
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
              the date and time that they end. If you&#39;re a club organizer,
              feel free to post your own event 🎟!
            </p>
          </div>
          <Image
            src={'/assets/calendar.svg'}
            height={300}
            width={300}
            alt="Calendar Image"
          />
        </div>

        {session ? (
          <>
            <div className={formstyles.tabs}>
              <button
                onClick={() => setTab(0)}
                className={
                  tab === 0
                    ? `${formstyles.active} ${formstyles.tab}`
                    : `${formstyles.tab}`
                }
              >
                All Events
              </button>
              <button
                onClick={() => setTab(1)}
                className={
                  tab === 1
                    ? `${formstyles.active} ${formstyles.tab}`
                    : `${formstyles.tab}`
                }
              >
                Member Events
              </button>
            </div>
            {tab === 0 ? (
              <>
                <h2>All Events</h2>
                <ListAllEvents />
              </>
            ) : (
              <>
                <h2>Member Events</h2>
                <ListUserEvents />
              </>
            )}
          </>
        ) : (
          <>
            <h2>Recent Events</h2>
            <ListAllEvents />
          </>
        )}
      </section>
    </Layout>
  )
}
