import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import Layout from '../components/Layout'
import styles from '@/styles/404.module.css'

export default function Custom500() {
  return (
    <Layout>
      <Head>
        <title>Nexus | 500</title>
      </Head>
      <h1 className={styles.title}>Hmm... how did you get here?</h1>
      <p>
        It seems you tried to reach a page which does not exist{' '}
        <i>on our backend</i>. We recommend using pages that do exist 😄.
      </p>
      <Link href={'/'} passHref>
        <a>Go back home</a>
      </Link>
      <Image src={'/assets/404.svg'} height={500} width={500} alt="404 Image" />
    </Layout>
  )
}
