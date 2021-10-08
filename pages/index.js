import Head from 'next/head'
import clientPromise from '@/lib/mongodb'
import Layout from '@/components/Layout'

export default function Home({ isConnected }) {
  return (
    <Layout>
      <Head>
        <title>Nexus</title>
        {/* Change this icon when we have a logo */}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section>
        <h1>Welcome to Nexus.</h1>
        {isConnected ? (
          <h2>You are successfully connected to MongoDB.</h2>
        ) : (
          <h2>
            You are NOT connected to MongoDB. Check the <code>README.md</code>{' '}
            for instructions.
          </h2>
        )}
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
