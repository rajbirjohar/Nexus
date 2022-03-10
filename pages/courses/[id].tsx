import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import Page from '@/components/Layout/Page'
import clientPromise from '@/lib/mongodb'
import ReviewForm from '@/components/Reviews/ReviewForm'
import ListReviews from '@/components/Reviews/ListReviews'
import styles from '@/styles/courses.module.css'
import { LeftChevronIcon } from '@/components/Icons'
import Accordion from '@/components/Layout/Accordion'

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
            <a className={styles.link}>
              <LeftChevronIcon />
              Go back to courses
            </a>
          </Link>
          <div className={styles.courseheader}>
            <h1 className={styles.title}>{course.subjectCourse}</h1>
            <h1 className={styles.difficulty}>
              <span>Difficulty:</span> {rating || 0}/10
            </h1>
          </div>

          <h4>{course.courseTitle}</h4>
          {!session && <p>Please sign in to write a review.</p>}
          {session && session.user.roles && session.user.roles.includes('none') && (
            <Link href="/profile" passHref>
              <a>Please verify if you are a student.</a>
            </Link>
          )}
          {session &&
            session.user.roles &&
            session.user.roles.includes('professor') && (
              <p>Professors cannot post reviews.</p>
            )}
          {session &&
            session.user.roles &&
            session.user.roles.includes('student') && (
              <Accordion heading={'Write Review'}>
                <ReviewForm
                  course={course.subjectCourse}
                  courseId={course._id}
                />
              </Accordion>
            )}
        </>
      ))}
      <ListReviews courseId={id} />
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
    .collection('reviews')
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
