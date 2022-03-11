import React, { useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useSession, signIn } from 'next-auth/react'
import HeroLayout from '@/components/Layout/HeroLayout'
import styles from '@/styles/index.module.css'
import { LottieWrapper } from '@/components/LottieWrapper'
import heroAnimationData from '@/lotties/puzzleplantcropped.json'
import teamAnimationData from '@/lotties/teamblue.json'
import partyAnimationData from '@/lotties/party.json'
import booksAnimationData from '@/lotties/bookstack.json'
import signAnimationData from '@/lotties/heart.json'
import searchAnimationData from '@/lotties/searching.json'
import rocketAnimationData from '@/lotties/rocket.json'
import checkAnimationData from '@/lotties/check.json'
import professorAnimationData from '@/lotties/professor.json'
import { RightArrowIcon } from '@/components/Icons'

const HeroCard = ({ animationData, title, children }) => {
  return (
    <div className={styles.card}>
      <div className={styles.animationWrapperSmall}>
        <LottieWrapper animationData={animationData} />
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
        <link rel="icon" href="/NexusLogo.svg" />
      </Head>
      <section className={`${styles.hero} ${styles.centered}`}>
        <div className={styles.content}>
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
              <RightArrowIcon />
            </button>
          )}
        </div>
        <div className={styles.animationWrapper}>
          <LottieWrapper animationData={heroAnimationData} />
        </div>
      </section>
      <section className={styles.herocardsWrapper}>
        <section className={styles.herocards}>
          <HeroCard animationData={searchAnimationData} title="Learn">
            Know what to expect before you walk into your first day of class.
            Never again be blindsided by a teaching style, material, and exams.
          </HeroCard>
          <HeroCard animationData={checkAnimationData} title="Fast">
            Posts are instantly uploaded so you know you have the most up to
            date information. Courses are scraped directly from UCR&#39;s
            website.
          </HeroCard>
          <HeroCard animationData={rocketAnimationData} title="Explore">
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
          <LottieWrapper animationData={booksAnimationData} />
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
          <Link href="/courses" passHref>
            <a className={styles.link}>
              Go to courses <RightArrowIcon />
            </a>
          </Link>
        </div>
      </section>

      <section className={styles.hero}>
        <div className={styles.content}>
          <h3 className={styles.sectiontitle}>Events</h3>
          <h2>Be In the Know</h2>
          <p>
            Stay up-to date on the latest events on campus. Socialize with your
            peers and make life long connections. Find your academic and social
            life balance through Nexus.
          </p>
          <h2>Promote Your Events</h2>
          <p>
            No need to create flyers for your events. Instantly share any
            changes so no one misses out. Nexus will create the hype for you
            with a single post.
          </p>
          <Link href="/events" passHref>
            <a className={styles.link}>
              Go to events <RightArrowIcon />
            </a>
          </Link>
        </div>
        <div className={styles.animationWrapper}>
          <LottieWrapper animationData={partyAnimationData} />
        </div>
      </section>

      <section className={styles.heroreverse}>
        <div className={styles.animationWrapper}>
          <LottieWrapper animationData={teamAnimationData} />
        </div>
        <div className={styles.content}>
          <h3 className={styles.sectiontitle}>Organizations</h3>
          <h2>Find Your Passion</h2>
          <p>
            Explore every UCR affiliated organization with a click of a button.
            View important and up-to date information on clubs that catch your
            eye. Use Nexus as a tool to discover more about yourself.
          </p>
          <h2>Discover Like-minded People</h2>
          <p>
            Post promotional pictures about your club to recruit new members.
            Make information available to everyone at UCR in an instant.
            Organizations can always rely on Nexus to keep their members in
            touch.
          </p>
          <Link href="/organizations" passHref>
            <a className={styles.link}>
              Go to organizations <RightArrowIcon />
            </a>
          </Link>
        </div>
      </section>
      
      <section className={styles.heroreverselast}>
        <div className={styles.content}>
          <h3 className={styles.sectiontitle}>Opportunities</h3>
          <h2>Gain Experience</h2>
          <p>
            Learn about jobs, internships, and other opportunities on and off 
            campus. There are hundreds of opportunities available to students 
            provided by the campus, professors, and corporations that will 
            get you ready for your career. 
          </p>
          <h2>Learn About Careers</h2>
          <p>
            Discover career paths that you never knew about. Exploring careers 
            now may prepare you for a job once you graduate and help
            you achieve your dream life.
          </p>
          <Link href="/opportunities" passHref>
            <a className={styles.link}>
              Go to opportunities <RightArrowIcon />
            </a>
          </Link>
        </div>
        <div className={styles.animationWrapper}>
          <LottieWrapper animationData={professorAnimationData} />
        </div>
      </section>
      
      <section className={styles.endheroWrapper}>
        <div className={`${styles.endhero} ${styles.centered}`}>
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
            <LottieWrapper animationData={signAnimationData} />
          </div>
        </div>
      </section>
    </HeroLayout>
  )
}
