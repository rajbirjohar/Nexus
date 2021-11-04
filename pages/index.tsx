import Head from 'next/head'
import Image from 'next/image'
import clientPromise from '@/lib/mongodb'
import { useSession } from 'next-auth/react'
import Layout from '@/components/Layout'
import styles from '@/styles/index.module.css'

export default function Home({ isConnected }) {
  const { data: session } = useSession()

  return (
    <Layout>
      <Head>
        <title>Nexus</title>
        {/* Change this icon when we have a logo */}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className={styles.hero}>
        <div className={styles.heroImage}>
          <Image
            src={'/assets/information.svg'}
            height={500}
            width={500}
            alt="Hero Image"
          />
        </div>
        <div className={styles.content}>
          <h1>Nexus @ UCR</h1>
          <h3 className={styles.subtitle}>Where Information Gathers</h3>
          {session && (
            <>
              {isConnected ? (
                // Display this message when the user has successfully logged in
                // AND connected to our database
                <h3>
                  Hi, {session.user.name}! Let&#39;s learn something new today.
                </h3>
              ) : (
                <h3>
                  Oops. Something went wrong when trying to log you in
                  pertaining to our database. Please try again or let us know if
                  this persists.
                </h3>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  let isConnected
  try {
    const client = await clientPromise
    isConnected = true
  } catch (e) {
    console.log(e)
    isConnected = false
  }

  return {
    props: { isConnected },
  }
}
