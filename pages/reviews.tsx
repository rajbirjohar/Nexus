import Head from 'next/head'
import Layout from '@/components/Layout'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import ReviewPostForm from '@/components/Reviews/ReviewPostForm'
import ListReviewPosts from '@/components/Reviews/ListReviewPosts'

export default function ReviewsPage() {
  const { data: session, status } = useSession()
  return (
    <Layout>
      <Head>Nexus | Reviews</Head>
      <section>
        <h1>Reviews</h1>
        {session && (
          <>
            <ReviewPostForm name={session.user.name} email={session.user.email} />
          </>
        )}
        <ListReviewPosts />
      </section>
    </Layout>
  )
}
