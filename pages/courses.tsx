import Head from 'next/head'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import Layout from '@/components/Layout'
import ListCourses from '@/components/Courses/ListCourses'

export default function CoursesPage() {
  const { data: session, status } = useSession()
  return (
    <Layout>
      <Head>
        <title>Nexus | Courses</title>
      </Head>
      <section>
        <h1>Courses</h1>
        <p>
          Check out any course below. Each course will come with a list of
          reviews that other people have written from their experiences as a
          student. Feel free to write your own for future readers.
        </p>
        <ListCourses />
      </section>
    </Layout>
  )
}