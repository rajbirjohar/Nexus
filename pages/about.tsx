import Head from 'next/head'
import Layout from '@/components/Layout'
import styles from '@/styles/about.module.css'

export default function aboutPage() {
  return (
    <Layout>
      <Head>
        <title>Nexus | Organizations</title>
        {/* Change this icon when we have a logo */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section>
        <h1>About Us</h1>
        <p>Founded October 2021. </p>
        <p>Developed at University of California, Riverside. </p>
        <p>Nexus was made with the intent to centralize the decentralized.</p>
        <p>
          Information on classes, clubs, and organizations span many different
          sites and media that students may not always be following. Nexus aims
          to provide a single place where students are able to find the
          information they need. From class reviews and info to club posts and
          events, Nexus is <i>where information gathers</i>.
        </p>
        <p>
          The team behind Nexus is comprised of five computer science students:
          <p>
            Rajbir Johar
            <br /> Isaac Curiel
            <br /> Brian Coffey
            <br /> Robert Rivera
            <br /> Florian Catalan
          </p>
        </p>
      </section>
    </Layout>
  )
}
