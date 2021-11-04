import Head from 'next/head'
import Image from 'next/image'
import Layout from '@/components/Layout'
import { useSession } from 'next-auth/react'
import OrganizationsPostForm from '@/components/Organizations/OrganizationsPostForm'
import ListOrganizations from '@/components/Organizations/ListOrganizations'
import styles from '@/styles/organizations.module.css'

export default function OrganizationsPage() {
  const { data: session } = useSession()
  return (
    <Layout>
      <Head>
        <title>Nexus | Organizations</title>
        {/* Change this icon when we have a logo */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section>
        <div className={styles.hero}>
          <Image src={'/assets/club.svg'} width={300} height={300} alt='Club page' />
          <div className={styles.content}>
            <h1>Organizations</h1>
            <p>
              Looking for a specific club or org event? Here you can sort all
              the events by their specific club and read more about them. Try
              creating your own!
            </p>
          </div>
        </div>
        {session && (
          <>
            <OrganizationsPostForm
              name={session.user.name}
              email={session.user.email}
            />
          </>
        )}
        <ListOrganizations />
      </section>
    </Layout>
  )
}
