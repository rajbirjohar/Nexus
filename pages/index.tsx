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

      <section className={styles.hero}>
        <div className={styles.content}>
          <h3>Courses</h3>
          <h1>Register for classes with confidence</h1>
          <p>
            Knowing the difficulty of a class can help you manage your courseload. 
            Nexus provides you with a preview of a class that you are interested in.
            Learn from past students' experiences to determine which professor
            you are more compatible with.
          </p>
          <br/>
          <h1>Lay the path for future students</h1>
          <p>
            Post your experience and rate the difficulty for any course at UCR.
            Provide feedback on the course structure and the professor.
            With students' reviews, Nexus can help students be better prepared for future quarters.
          </p>
        </div>
        <div className={styles.heroImage}>
          <Image
            src={'/assets/feedback.svg'}
            height={500}
            width={500}
            alt="Hero Image"
          />
        </div>
      </section>

      <section className={styles.hero}>
        <div className={styles.heroImage}>
          <Image
            src={'/assets/partying.svg'}
            height={500}
            width={500}
            alt="Hero Image"
          />
        </div>
        <div className={styles.content}>
          <h3>Events</h3>
          <h1>Support the Orgs</h1>
          <p>
            Stay up-to date on the latest events on campus.
            Socialize with your peers and make life long connections.
            Find your academic and social life balance through Nexus.
          </p>
          <br/>
          <h1>Promote your Org</h1>
          <p>
            No need to create flyers for your events.
            Instantly share any changes so no one misses out.
            Nexus will create the hype for you with a single post.
          </p>
        </div>
      </section>

      <section className={styles.hero}>
        <div className={styles.content}>
          <h3>Organizations</h3>
          <h1>Find your passion</h1>
          <p>
            Explore every UCR affiliated organization with a click of a button.
            View important and up-to date information on clubs that catch your eye.
            Use Nexus as a tool to discover more about yourself.
          </p>
          <br/>
          <h1>Find similar people</h1>
          <p>
            Post promotional pictures about your club to recruit new members.
            Make information available to everyone at UCR in an instant.
            Organizations can always rely on Nexus to keep their members in touch.
          </p>
        </div>
        <div className={styles.heroImage}>
          <Image
            src={'/assets/community.svg'}
            height={500}
            width={500}
            alt="Hero Image"
          />
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
