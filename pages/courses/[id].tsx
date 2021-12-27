import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import Layout from '@/components/Layout'
import clientPromise from '@/lib/mongodb'
import ReviewPostForm from '@/components/Reviews/ReviewPostForm'
import ListReviewPosts from '@/components/Reviews/ListReviewPosts'
import styles from '@/styles/courses.module.css'
import formstyles from '@/styles/form.module.css'
import { motion, AnimatePresence } from 'framer-motion'

const list = {
  closed: {
    height: '0',
    transition: {
      when: 'afterChildren',
    },
  },
  open: {
    height: 'auto',
  },
}

const listItems = {
  closed: {
    opacity: 0,
    y: -5,
    transition: {
      duration: 0.15,
    },
  },
  open: {
    opacity: 1,
    y: 0,
  },
}

const button = {
  closed: {
    rotate: 0,
    transition: {
      duration: 0.05,
      delay: 0,
      ease: 'easeOut',
    },
  },
  open: {
    rotate: 45,
    transition: {
      duration: 0.05,
      delay: 0,
      ease: 'easeIn',
    },
  },
}

// Page: CourseReviews({course})
// Params: course
// Purpose: Dynamically display all the reviews pertaining to the
// specific course that that the user has selected

const CourseReviews = ({ course, averageRating }) => {
  const router = useRouter()
  const { id } = router.query
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const rating = averageRating
    .map((averageRating) => averageRating.average)
    .toString()
  return (
    <Layout>
      {course.map((course) => (
        <>
          <Head>
            <title>Nexus | {course.subjectCourse}</title>
            {/* Change this icon when we have a logo */}
            <link rel="icon" href="/favicon.ico" />
          </Head>
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
              <>
                <div className={formstyles.revealheader}>
                  <h2>Write Review</h2>
                  <motion.button
                    initial="closed"
                    variants={button}
                    animate={open ? 'open' : 'closed'}
                    className={formstyles.revealprimary}
                    onClick={() => setOpen(!open)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </motion.button>
                </div>
                <AnimatePresence exitBeforeEnter>
                  {open && (
                    <motion.div
                      animate={open ? 'open' : 'closed'}
                      variants={list}
                      exit="closed"
                      initial="closed"
                    >
                      <motion.div variants={listItems}>
                        <ReviewPostForm
                          course={course.subjectCourse}
                          courseId={course._id}
                        />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
        </>
      ))}
      <ListReviewPosts courseId={id} />
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
