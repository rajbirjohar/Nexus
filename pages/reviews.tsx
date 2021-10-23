import Head from 'next/head'
import Layout from '@/components/Layout'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import PostForm from '@/components/PostForm'
import Posts from '@/components/Posts'

export default function ReviewsPage() {
  const { data: session, status } = useSession()
  return (
    <Layout>
      <Head>Nexus | Reviews</Head>
      <section>
        <h1>Reviews</h1>
        {session && (
          <>
            <PostForm name={session.user.name} email={session.user.email} />
          </>
        )}
        <Posts />
      </section>
    </Layout>
  )
}
