import Head from 'next/head'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import Layout from '@/components/Layout'
import { connectToDatabase } from '@/util/connectToDb'
import ReviewPostForm from '@/components/Reviews/ReviewPostForm'
import ListReviewPosts from '@/components/Reviews/ListReviewPosts'

const CourseReviews = ({ course }) => {
  const router = useRouter()
  const { id } = router.query
  const { data: session, status } = useSession()
  return (
    <Layout>
      <Head>
        <title>Nexus | {id}</title>
        {/* Change this icon when we have a logo */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {course.map((course) => (
        <>
          <h1>{course.name}</h1>
          {session && (
            <>
              <ReviewPostForm
                name={session.user.name}
                email={session.user.email}
                course={course.name}
              />
            </>
          )}
        </>
      ))}
      <ListReviewPosts course={id} />
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const { id } = context.query
  const { db } = await connectToDatabase()
  const course = await db.collection('courses').find({ name: id }).toArray()
  return {
    props: {
      course: JSON.parse(JSON.stringify(course)),
    },
  }
}

export default CourseReviews
