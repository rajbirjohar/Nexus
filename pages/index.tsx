import Head from 'next/head'
import Image from 'next/image'
import clientPromise from '@/lib/mongodb'
import { useSession } from 'next-auth/react'
import Layout from '@/components/Layout'
import styles from '@/styles/index.module.css'
import Lottie, { useLottie } from 'lottie-react'
import { motion } from 'framer-motion'
import heroAnimationData from '../lotties/social.json'
import teamAnimationData from '../lotties/team.json'
import partyAnimationData from '../lotties/party.json'
import booksAnimationData from '../lotties/books.json'

const style = {
  height: 400,
  width: '100%',
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      delayChildren: 0.5,
      staggerChildren: 0.1,
      ease: 'easeInOut',
      duration: 0.75,
    },
  },
}

const listItem = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0 },
}

export default function Home() {
  const { data: session } = useSession()
  return (
    <Layout>
      <Head>
        <title>Nexus</title>
        {/* Change this icon when we have a logo */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <motion.section initial="hidden" animate="show" variants={container}>
        <div className={styles.hero}>
          <motion.div variants={listItem} className={styles.animationWrapper}>
            <Lottie
              animationData={heroAnimationData}
              style={style}
              renderer="canvas"
            />
          </motion.div>
          <motion.div variants={listItem} className={styles.content}>
            <h3 className={styles.subtitle}>Nexus @ UCR</h3>
            <h1 className={styles.title}>
              We&#39;re here to centralize the decentralized.
              <br /> <span>Where information gathers</span>.
            </h1>

            {session && (
              // Display this message when the user has successfully logged in
              // AND connected to our database
              <>
                <h4>
                  Hi, {session.user.name}! Let&#39;s learn something new today.
                </h4>
              </>
            )}
          </motion.div>
        </div>

        <div className={styles.heroreverse}>
          <motion.div variants={listItem} className={styles.content}>
            <h3 className={styles.sectiontitle}>Courses</h3>
            <h4>Register with Confidence</h4>
            <p>
              Knowing the difficulty of a class can help you manage your
              courseload. Nexus provides you with a preview of a class that you
              are interested in. Learn from past students&#39; experiences to
              determine which professor you are more compatible with.
            </p>
            <h4>Lay the Path</h4>
            <p>
              Post your experience and rate the difficulty for any course at
              UCR. Provide feedback on the course structure and the professor.
              With students&#39; reviews, Nexus can help students be better
              preparose for future quarters.
            </p>
          </motion.div>
          <motion.div variants={listItem} className={styles.animationWrapper}>
            <Lottie
              animationData={booksAnimationData}
              style={style}
              renderer="canvas"
            />
          </motion.div>
        </div>

        <div className={styles.hero}>
          <motion.div variants={listItem} className={styles.animationWrapper}>
            <Lottie
              animationData={partyAnimationData}
              style={style}
              renderer="canvas"
            />
          </motion.div>
          <motion.div variants={listItem} className={styles.content}>
            <h3 className={styles.sectiontitle}>Events</h3>
            <h4>Support the Orgs</h4>
            <p>
              Stay up-to date on the latest events on campus. Socialize with
              your peers and make life long connections. Find your academic and
              social life balance through Nexus.
            </p>
            <h4>Promote your Events</h4>
            <p>
              No need to create flyers for your events. Instantly share any
              changes so no one misses out. Nexus will create the hype for you
              with a single post.
            </p>
          </motion.div>
        </div>

        <div className={styles.heroreverse}>
          <motion.div variants={listItem} className={styles.content}>
            <h3 className={styles.sectiontitle}>Organizations</h3>
            <h4>Find your Passion</h4>
            <p>
              Explore every UCR affiliated organization with a click of a
              button. View important and up-to date information on clubs that
              catch your eye. Use Nexus as a tool to discover more about
              yourself.
            </p>
            <h4>Discover like-minded people</h4>
            <p>
              Post promotional pictures about your club to recruit new members.
              Make information available to everyone at UCR in an instant.
              Organizations can always rely on Nexus to keep their members in
              touch.
            </p>
          </motion.div>
          <motion.div variants={listItem} className={styles.animationWrapper}>
            <Lottie
              animationData={teamAnimationData}
              style={style}
              renderer="canvas"
            />
          </motion.div>
        </div>
      </motion.section>
    </Layout>
  )
}
