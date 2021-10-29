import Head from 'next/head'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'

const Organization = () => {
  const router = useRouter()
  const { id } = router.query

  return (
    <Layout>
      <Head>
        <title>Nexus | {id}</title>
        {/* Change this icon when we have a logo */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>{id}</h1>
    </Layout>
  )
}

export default Organization
