import React, { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Router, { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import Layout from '@/components/Layout'
import ListUserPosts from '@/components/Profile/ListUserPosts'
import ListUserOrganizations from '@/components/Profile/ListUserOrganizations'
import ListNotifications from '@/components/Profile/ListNotifications'
import styles from '@/styles/profile.module.css'
import formstyles from '@/styles/form.module.css'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'

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

const listItems = {
  closed: {
    opacity: 0,
    y: -5,
    transition: {
      duration: 0.15,
    },
  },
  open: {
    opacity: 1,
    y: 0,
  },
}

const Section = ({ header, children }) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div className={formstyles.revealheader}>
        <h2>{header}</h2>
        <button
          className={
            open
              ? `${formstyles.reveal} ${formstyles.rotated}`
              : `${formstyles.reveal} `
          }
          onClick={() => setOpen(!open)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <AnimatePresence exitBeforeEnter>
        {open ? (
          <motion.div
            animate={open ? 'open' : 'closed'}
            variants={list}
            exit="closed"
            initial="closed"
          >
            <motion.div variants={listItems}>{children}</motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}

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
  const [userRole, setUserRole] = useState({
    _role: '',
    displayWarning: true,
  })
  const allTabs = [
    {
      icon: '🍅',
      label: 'Organizations',
      id: 'organizations',
      component: <ListUserOrganizations />,
    },
    {
      icon: '🥬',
      label: 'Reviews',
      id: 'reviews',
      component: <ListUserPosts />,
    },
  ]

  const [organizations, reviews] = allTabs
  const initialTabs = [organizations, reviews]
  const [selectedTab, setSelectedTab] = useState(initialTabs[0])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (userRole._role === '') {
      toast.error('Please fill out your role.')
    } else if (userRole._role === 'student' || userRole._role === 'professor') {
      sendData(userRole)
      setUserRole({
        _role: '',
        displayWarning: false,
      })
    } else {
      toast.error('Your input is incorrect. Please try again.')
    }
  }

  const handleChange = (event) => {
    setUserRole({
      ...userRole,
      _role: event.target.value,
    })
  }

  const sendData = async (userRoleData) => {
    const response = await fetch('/api/users/setrole', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userRoleData: userRoleData }),
    })
    const data = await response.json()

    if (response.status === 200) {
      toast.success("You've set your role!")
      Router.reload()
    } else {
      toast.error(
        'Uh oh. Something happened. Please contact us if this persists.'
      )
    }
  }

  return (
    <Layout>
      <Head>
        <title>Nexus | Profile</title>
        {/* Change this icon when we have a logo */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {session &&
        session.user.role &&
        session.user.role.includes('none') &&
        userRole.displayWarning && (
          <div>
            <h3>Student or Professor?</h3>
            <p>
              <strong>
                Please tell us what your position is at University.
                <br />
                You won&#39;t be able to change this after you submit.
              </strong>
              <br />
              Please enter <strong>&#34;student&#34;</strong> if you are a
              student.
              <br />
              Please enter <strong>&#34;professor&#34;</strong> if you are a
              professor.
            </p>
            <form onSubmit={handleSubmit} className={styles.form}>
              <label htmlFor="_role">
                <strong>Position:</strong>
              </label>
              <input
                autoComplete="off"
                aria-label="User Role Input"
                name="_role"
                value={userRole._role}
                onChange={handleChange}
                type="text"
                placeholder="Role"
                className={styles.input}
              />

              <button className={styles.setrolebutton} type="submit">
                Set Role
              </button>
            </form>
          </div>
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
            Happy posting 🎉!
          </p>
        </div>
      </div>

      {session && (
        <>
          <LayoutGroup>
            <Section header="Notifications">
              <ListNotifications />
            </Section>
          </LayoutGroup>
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
                      layoutId="profile"
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
