import React, { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import Layout from '@/components/Layout'
import ListReviewPosts from '@/components/Reviews/ListProfilePosts'
import Loader from '@/components/Skeleton'
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
  })

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (userRole._role === '') {
      toast.error('Please fill out your role.')
    } else if (userRole._role === 'student' || userRole._role === 'professor') {
      sendData(userRole)
    } else {
      toast.error('Your input is incorrect. Please try again.')
    }
  }

  const handleChange = (event) => {
    setUserRole({
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
      toast.success("You've set your role")
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
      {session && session.user.role.includes('none') && (
        <div className={styles.warningWrapper}>
          <p>
            <strong>
              Attention:
              <br />
              Please tell us what your position is at University.
              <br />
              You won&#39;t be able to change this after you submit.
            </strong>
            <br />
            Please enter <strong>&#34;student&#34;</strong> if you are a student.
            <br />
            Please enter <strong>&#34;professor&#34;</strong> if you are a professor.
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
