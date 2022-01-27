import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import Page from '@/components/Layout/Page'
import clientPromise from '@/lib/mongodb'
import ReviewPostForm from '@/components/Reviews/ReviewPostForm'
import ListReviewPosts from '@/components/Reviews/ListReviewPosts'
import styles from '@/styles/courses.module.css'
import formstyles from '@/styles/form.module.css'
import Dropdown from '@/components/Layout/Dropdown'
import { motion } from 'framer-motion'

const CourseReviews = ({ course, averageRating }) => {
  const router = useRouter()
  const { id } = router.query
  const { data: session } = useSession()
  const rating = averageRating
    .map((averageRating) => averageRating.average)
    .toString()
  return (
    <Page title={`${course.map((course) => course.subjectCourse)}`} tip={null}>
      {course.map((course) => (
        <>
          <Link href="/courses" passHref>
            <a className={formstyles.linkwrap}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Go back to courses
            </a>
          </Link>
          <div className={styles.courseheader}>
            <h1>{course.subjectCourse}</h1>
            <h1 className={styles.difficulty}>
              <span>Average:</span> {rating}
            </h1>
          </div>

          <h4>{course.courseTitle}</h4>
          {!session && <p>Please sign in to write a review.</p>}
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
              <Dropdown heading={'Write Review'}>
                <ReviewPostForm
                  course={course.subjectCourse}
                  courseId={course._id}
                />
              </Dropdown>
            )}
        </>
      ))}
      <ListReviewPosts courseId={id} />
    </Page>
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
  const averageRating = await db
    .collection('reviewPosts')
    .aggregate([
      {
        $match: {
          course: id,
        },
      },
      {
        $group: {
          _id: '$course',
          average: { $avg: '$difficulty' },
        },
      },
      { $addFields: { average: { $trunc: ['$average', 1] } } },
    ])
    .toArray()
  return {
    props: {
      course: JSON.parse(JSON.stringify(course)),
      averageRating: JSON.parse(JSON.stringify(averageRating)),
    },
  }
}

export default CourseReviews
