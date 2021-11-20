import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import Layout from '@/components/Layout'
import clientPromise from '@/lib/mongodb'
import ReviewPostForm from '@/components/Reviews/ReviewPostForm'
import ListReviewPosts from '@/components/Reviews/ListReviewPosts'

// Page: CourseReviews({course})
// Params: course
// Purpose: Dynamically display all the reviews pertaining to the
// specific course that that the user has selected

const CourseReviews = ({ course }) => {
  const router = useRouter()
  const { id } = router.query
  const { data: session } = useSession()
  return (
    <Layout>
      <Head>
        <title>Nexus | {id}</title>
        {/* Change this icon when we have a logo */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {course.map((course) => (
        <>
          <h1>{course.subjectCourse}</h1>
          <h2>{course.courseTitle}</h2>
          {session && session.user.role && session.user.role.includes('none') && (
            <Link href="/profile" passHref>
              <a>Please verify if you are a student.</a>
            </Link>
          )}
          {session &&
            session.user.role &&
            session.user.role.includes('professor') && (
              <p>Professors cannot post reviews.</p>
            )}
          {session &&
            session.user.role &&
            session.user.role.includes('student') && (
              <>
                <ReviewPostForm
                  name={session.user.name}
                  email={session.user.email}
                  course={course.subjectCourse}
                />
              </>
            )}
        </>
      ))}
      <ListReviewPosts course={id} />
    </Layout>
  )
}

// We are using getServerSideProps instead of an endpoint fetched
// with SWR. This allows us to prefetch our data with what is returned
// from the database (a list of all of our courses) mainly because
// this data does not change often so we don't have to revalidate it
// But the dynamic pages that are following it are updated frequently
export async function getServerSideProps(context) {
  const { id } = context.query
  const db = (await clientPromise).db(process.env.MONGODB_DB)
  const course = await db
    .collection('allCourses')
    .find({ subjectCourse: id })
    .toArray()
  return {
    props: {
      course: JSON.parse(JSON.stringify(course)),
    },
  }
}

export default CourseReviews
