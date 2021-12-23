import React, { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Router, { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import Layout from '@/components/Layout'
import ListUserPosts from '@/components/Reviews/ListUserPosts'
import styles from '@/styles/profile.module.css'
import formstyles from '@/styles/form.module.css'
import ListUserOrganizations from '@/components/Organizations/ListUserOrganizations'

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
  const [tab, setTab] = useState(0)

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
            <form onSubmit={handleSubmit} className={styles.inputWrapper}>
              <label htmlFor="_role">
                <strong>Position:</strong>
              </label>
              <input
                aria-label="User Role Input"
                name="_role"
                value={userRole._role}
                onChange={handleChange}
                type="text"
                placeholder="Role"
                className={styles.input}
              />
              <div className={styles.actions}>
                <button className={styles.setrolebutton} type="submit">
                  Set Role
                </button>
              </div>
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
        <Image
          src={'/assets/profile.svg'}
          height={300}
          width={300}
          alt="Profile Image"
        />
      </div>
      <div className={formstyles.tabs}>
        <button
          onClick={() => setTab(0)}
          className={
            tab === 0
              ? `${formstyles.active} ${formstyles.tab}`
              : `${formstyles.tab}`
          }
        >
          Organizations
        </button>
        <button
          onClick={() => setTab(1)}
          className={
            tab === 1
              ? `${formstyles.active} ${formstyles.tab}`
              : `${formstyles.tab}`
          }
        >
          Reviews
        </button>
      </div>
      {session && (
        <>
          {tab === 0 ? (
            <>
              <h2>Your Organizations</h2>
              <ListUserOrganizations />
            </>
          ) : (
            <>
              <h2>Your Reviews</h2>
              <ListUserPosts />
            </>
          )}
          <blockquote className={styles.quote}>
            Rage, rage against the dying of the light.
          </blockquote>
        </>
      )}
    </Layout>
  )
}
