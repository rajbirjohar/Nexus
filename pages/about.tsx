import Head from 'next/head'
import Layout from '@/components/Layout/Layout'
import styles from '@/styles/about.module.css'

export default function aboutPage() {
  return (
    <Layout>
      <Head>
        <title>Nexus | Organizations</title>
        {/* Change this icon when we have a logo */}
        <link rel="icon" href="/NexusLogo.svg" />
      </Head>
      <section className={styles.content}>
        <h1>About Us</h1>
        <p>
          Founded <strong>October 2021 🧑‍💻.</strong>
        </p>
        <p>
          Developed at the <strong>University of California, Riverside.</strong>
        </p>
        <p>
          Nexus was made with the intent to{' '}
          <strong>centralize the decentralized.</strong>
        </p>
        <p>
          Information on classes, clubs, and organizations span many different
          sites and media that students may not always be following. Nexus aims
          to provide a single place where students are able to find the
          information they need. From class reviews and info to club posts and
          events, Nexus is <i>where information gathers</i>.
        </p>
        <p>
          Written with 💻, ☕️, 🧠, and ❤️ by,
          <br />
          Isaac Curiel,
          <br />
          Brian Coffey,
          <br />
          <a
            rel="noopener noreferrer"
            href="https://rajbir.io/"
            target="_blank"
          >
            Rajbir Johar
          </a>
          <br />
          Robert Rivera,
          <br />
          and Florian Catalan.
        </p>
        <p>
          Special thanks to,
          <br />
          Danial Beg for offering his apartment for us to code at.
          <br /> Matthew Lee and Jason Lin for making brownies.
          <br /> Jason Lin for helping us with the slider.
          <br /> and Audrey Kim for being our beta tester.
        </p>
      </section>
    </Layout>
  )
}
