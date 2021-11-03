import Head from 'next/head'
import Layout from '@/components/Layout'
import { useSession } from 'next-auth/react'
import OrganizationsPostForm from '@/components/Organizations/OrganizationsPostForm'
import ListOrganizations from '@/components/Organizations/ListOrganizations'

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
        <p>
          Founded in October 2021. <br/>
          Developed at University of California, Riverside. <br/>
          Nexus was made with the intent to centralize the decentralized. Information on classes, clubs, and organizations span many different
          sites and media that students may not always be following. Nexus aims to provide a single place where students are able to find the
          information they need. From class reviews and info to club posts and events, Nexus is where information gathers. <br/>
          The team behind Nexus is comprised of five computer science students:
          <ul> <li>Rajbir Johar</li>
          <li>Isaac Curiel</li>
          <li>Brian Coffey</li>
          <li>Robert Rivera</li>
          <li>Florian Catalan</li> </ul>
        </p>
      </section>
    </Layout>
  )
}
