import React, { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Router, { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import Layout from '@/components/Layout'
import ListReviewPosts from '@/components/Reviews/ListProfilePosts'
import styles from '@/styles/profile.module.css'

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
      Router.reload()
      toast.success("You've set your role.")
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
        session.user.role.includes('none') &&
        userRole.displayWarning && (
          <div className={styles.warningWrapper}>
            <span className={styles.warningTitle}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p>
                <strong>Warning:</strong>
              </p>
            </span>
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
                <strong>Welcome {session.user.name}!</strong>
              </p>
            </>
          )}
          <p>
            Here you can view all your posts and organizations. Happy posting!
          </p>
        </div>
        <Image
          src={'/assets/profile.svg'}
          height={300}
          width={300}
          alt="Profile Image"
        />
      </div>
      <h2>Your Reviews</h2>
      <ListReviewPosts />
    </Layout>
  )
}
