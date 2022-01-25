import React, { useState } from 'react'
import Head from 'next/head'
import Layout from '@/components/Layout'
import { useSession } from 'next-auth/react'
import { LottieWrapper } from '@/components/LottieWrapper'
import CreatorRoleForm from '@/components/Organizations/CreatorRoleForm'
import OrganizationsForm from '@/components/Organizations/OrganizationsForm'
import ListOrganizations from '@/components/Organizations/ListOrganizations'
import { GreenTip } from '@/components/Tips'
import styles from '@/styles/organizations.module.css'
import formstyles from '@/styles/form.module.css'
import { motion, AnimatePresence } from 'framer-motion'
import animationData from '@/lotties/group.json'

const list = {
  closed: {
    height: '0',
    transition: {
      when: 'afterChildren',
    },
  },
  open: {
    height: 'auto',
  },
}

export default function OrganizationsPage() {
  const { data: session } = useSession()
  const [displayWarning, setDisplayWarning] = useState(false)

  return (
    <Layout>
      <Head>
        <title>Nexus | Organizations</title>
        {/* Change this icon when we have a logo */}
        <link rel="icon" href="/NexusLogo.svg" />
      </Head>
      <section>
        <div className={styles.hero}>
          <div className={styles.content}>
            <div className={styles.text}>
              <h1>Organizations</h1>
              <p>
                Looking for a specific club or organization? Here you can view
                them all at a glance. Each organization contains all of their
                own events so be sure to check those out 💃.
              </p>
              <GreenTip header="Find Your People">
                There is an organization for everyone! Joining an organization
                or a club is a great way to connect and meet new people.
              </GreenTip>
            </div>
            <div className={styles.animationWrapper}>
              <LottieWrapper animationData={animationData} />
            </div>
          </div>
        </div>
        {session &&
          session.user.role &&
          session.user.orgRole &&
          session.user.role.includes('student' || 'professor') &&
          session.user.orgRole.includes('none') && (
            <>
              <span className={formstyles.actions}>
                <button
                  className={formstyles.primary}
                  onClick={() => setDisplayWarning(!displayWarning)}
                >
                  Apply for Organizer
                </button>
              </span>
              <AnimatePresence exitBeforeEnter>
                {displayWarning && (
                  <motion.div
                    animate={displayWarning ? 'open' : 'closed'}
                    variants={list}
                    exit="closed"
                    initial="closed"
                    layout
                    className={formstyles.warningWrapper}
                  >
                    <CreatorRoleForm userId={session.user.id} />
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        {session &&
          session.user.orgRole &&
          session.user.orgRole.includes('Admin') &&
          session.user.creatorOfOrg.includes('none') && (
            <>
              <OrganizationsForm />
            </>
          )}
        <ListOrganizations />
      </section>
    </Layout>
  )
}
