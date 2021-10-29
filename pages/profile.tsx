import Head from 'next/head'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import Layout from '@/components/Layout'
import ListReviewPosts from '@/components/Reviews/ListProfilePosts'
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
      <Head>
        <title>Nexus | Profile</title>
        {/* Change this icon when we have a logo */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {status === 'loading' && <h1>Loading your profile...</h1>}
      {session && (
        <>
          <h1>Profile</h1>
          <p>
            <strong>Welcome {session.user.name}!</strong>
          </p>
          <h2>Your Reviews</h2>
          <ListReviewPosts />
        </>
      )}
    </Layout>
  )
}
