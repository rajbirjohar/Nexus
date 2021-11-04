import Head from 'next/head'
import Image from 'next/image'
import Layout from '../components/Layout'
import styles from '@/styles/404.module.css'

export default function Custom404() {
  return (
    <Layout>
      <Head>
        <title>Nexus | 404</title>
      </Head>
      <h1 className={styles.title}>
        Hmm... how did you get here? You reached nothing.
      </h1>
      <Image src={'/assets/404.svg'} height={500} width={500} alt="404 Image" />
    </Layout>
  )
}
