import Head from 'next/head'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import Layout from '@/components/Layout'
import ListReviewPosts from '@/components/Reviews/ListProfilePosts'
import Loader from '@/components/Skeleton'

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
      <h1>Profile</h1>
      {status === 'loading' && (
        <>
          <p>
            <strong>Loading your profile...</strong>
          </p>
          <Loader />
        </>
      )}
      {session && (
        <>
          <p>
            <strong>Welcome {session.user.name}!</strong>
          </p>
          <p>Here you can view all your posts and organizations.</p>
          <h2>Your Reviews</h2>
          <ListReviewPosts />
        </>
      )}
    </Layout>
  )
}
