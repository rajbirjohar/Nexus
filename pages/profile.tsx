import { useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import Layout from '@/components/Layout'
import { useSession } from 'next-auth/react'

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
    <Layout>
      <Head>Nexus | Profile</Head>
      {status === 'loading' && <h2>Loading your profile...</h2>}
      {session && (
        <>
          <h2>Welcome {session.user.name}!</h2>
          <p>This is your protected profile page.</p>
        </>
      )}
    </Layout>
  )
}
