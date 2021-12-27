import Head from 'next/head'
import Link from 'next/link'
import { useSession, signIn } from 'next-auth/react'
import HeroLayout from '@/components/HeroLayout'
import styles from '@/styles/index.module.css'
import Lottie, { useLottie } from 'lottie-react'
import heroAnimationData from '../lotties/puzzleplantcropped.json'
import teamAnimationData from '../lotties/teamblue.json'
import partyAnimationData from '../lotties/party.json'
import booksAnimationData from '../lotties/bookstack.json'
import signAnimationData from '../lotties/heart.json'
import searchAnimationData from '../lotties/searching.json'
import rocketAnimationData from '../lotties/rocket.json'
import checkAnimationData from '../lotties/check.json'

const style = {
  height: 500,
  width: '100%',
}

const stylesmall = {
  height: 200,
  width: '100%',
}

const HeroCard = ({ animation, title, children }) => {
  return (
    <div className={styles.card}>
      <div className={styles.animationWrapperSmall}>
        <Lottie
          animationData={animation}
          style={stylesmall}
          renderer="canvas"
        />
      </div>
      <h4 className={styles.cardTitle}>{title}</h4>
      <p className={styles.cardCaption}>{children}</p>
    </div>
  )
}

export default function Home() {
  const { data: session } = useSession()
  return (
    <HeroLayout>
      <Head>
        <title>Nexus</title>
        {/* Change this icon when we have a logo */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className={styles.hero}>
        <div className={styles.content}>
          <h3 className={styles.subtitle}>Nexus @ UCR</h3>
          <h1 className={styles.title}>
            Centralize the decentralized.
            <br /> <span>Where information gathers</span>.
          </h1>

          {session ? (
            <Link href="profile" passHref>
              <button className={styles.heroprimary}>
                Go to My Profile
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </Link>
          ) : (
            <button
              className={styles.heroprimary}
              onClick={() => signIn('google')}
            >
              Sign In with UCR
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          )}
        </div>
        <div className={styles.animationWrapper}>
          <Lottie
            animationData={heroAnimationData}
            style={style}
            renderer="canvas"
          />
        </div>
      </section>

      <section className={styles.herocardsWrapper}>
        <section className={styles.herocards}>
          <HeroCard animation={searchAnimationData} title="Learn">
            Know what to expect before you walk into your first day of class.
            Never again be blindsided by a professor&#39;s teaching style,
            material, and exams.
          </HeroCard>
          <HeroCard animation={checkAnimationData} title="Fast">
            Posts are instantly uploaded so you know you have the most up to
            date information. Courses are scraped directly from UCR&#39;s
            website.
          </HeroCard>
          <HeroCard animation={rocketAnimationData} title="Explore">
            Everything happening on campus, is happening right here. Find all
            current events and show your interest through comments.
          </HeroCard>
        </section>
      </section>
      <div className={styles.swipeIcon}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
          />
        </svg>
      </div>
      <section className={styles.heroreverse}>
        <div className={styles.animationWrapper}>
          <Lottie
            animationData={booksAnimationData}
            style={style}
            renderer="canvas"
          />
        </div>
        <div className={styles.content}>
          <h3 className={styles.sectiontitle}>Courses</h3>
          <h2>Register with Confidence</h2>
          <p>
            Knowing the difficulty of a class can help you manage your
            courseload. Nexus provides you with a preview of a class that you
            are interested in. Learn from past students&#39; experiences to
            determine which professor you are more compatible with.
          </p>
          <h2>Lay the Path</h2>
          <p>
            Post your experience and rate the difficulty for any course at UCR.
            Provide feedback on the course structure and the professor. With
            students&#39; reviews, Nexus can help students be better preparose
            for future quarters.
          </p>
        </div>
      </section>

      <section className={styles.hero}>
        <div className={styles.content}>
          <h3 className={styles.sectiontitle}>Events</h3>
          <h2>Support the Orgs</h2>
          <p>
            Stay up-to date on the latest events on campus. Socialize with your
            peers and make life long connections. Find your academic and social
            life balance through Nexus.
          </p>
          <h2>Promote your Events</h2>
          <p>
            No need to create flyers for your events. Instantly share any
            changes so no one misses out. Nexus will create the hype for you
            with a single post.
          </p>
        </div>
        <div className={styles.animationWrapper}>
          <Lottie
            animationData={partyAnimationData}
            style={style}
            renderer="canvas"
          />
        </div>
      </section>

      <section className={styles.heroreverse}>
        <div className={styles.animationWrapper}>
          <Lottie
            animationData={teamAnimationData}
            style={style}
            renderer="canvas"
          />
        </div>
        <div className={styles.content}>
          <h3 className={styles.sectiontitle}>Organizations</h3>
          <h2>Find your Passion</h2>
          <p>
            Explore every UCR affiliated organization with a click of a button.
            View important and up-to date information on clubs that catch your
            eye. Use Nexus as a tool to discover more about yourself.
          </p>
          <h2>Discover like-minded people</h2>
          <p>
            Post promotional pictures about your club to recruit new members.
            Make information available to everyone at UCR in an instant.
            Organizations can always rely on Nexus to keep their members in
            touch.
          </p>
        </div>
      </section>
      <section className={styles.endheroWrapper}>
        <div className={styles.endhero}>
          <div className={styles.content}>
            <h3 className={styles.sectiontitle}>Welcome</h3>

            {session ? (
              <>
                <h1 className={styles.title}>
                  Awesome. You&#39;re ready <span>to start</span>.
                </h1>
                <Link href="profile" passHref>
                  <button className={styles.heroprimary}>
                    Go to My Profile
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </button>
                </Link>
              </>
            ) : (
              <>
                <h1 className={styles.title}>
                  What are you waiting for? Start by <span>signing up</span>.
                </h1>
                <button
                  className={styles.heroprimary}
                  onClick={() => signIn('google')}
                >
                  Sign In with UCR
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>
          <div className={styles.animationWrapper}>
            <Lottie
              animationData={signAnimationData}
              style={style}
              renderer="canvas"
            />
          </div>
        </div>
      </section>
    </HeroLayout>
  )
}
