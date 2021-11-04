import Head from 'next/head'
import Image from 'next/image'
import Layout from '@/components/Layout'
import ListCourses from '@/components/Courses/ListCourses'
import styles from '@/styles/courses.module.css'

export default function CoursesPage() {
  return (
    <Layout>
      <Head>
        <title>Nexus | Courses</title>
      </Head>
      <section>
        <div className={styles.hero}>
          <div className={styles.content}>
            <h1>Courses</h1>
            <p>
              Check out any course below. Each course will come with a list of
              reviews that other people have written from their experiences as a
              student. Feel free to write your own for future readers.
            </p>
          </div>
          <Image src={'/assets/teaching.svg'} width={300} height={300} alt='Professor teaching' />
        </div>
        <ListCourses />
      </section>
    </Layout>
  )
}
