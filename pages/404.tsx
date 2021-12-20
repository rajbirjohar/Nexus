import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import Layout from '../components/Layout'
import styles from '@/styles/404.module.css'

export default function Custom404() {
  return (
    <Layout>
      <Head>
        <title>Nexus | 404</title>
      </Head>
      <h1>Hmm... how did you get here?</h1>
      <p>
        It seems you tried to reach a page which does not exist. We recommend
        using pages that do exist 😄.
      </p>
      <Link href={'/'} passHref>
        <a>Go back home</a>
      </Link>
      <Image src={'/assets/404.svg'} height={300} width={300} alt="404 Image" />
    </Layout>
  )
}
