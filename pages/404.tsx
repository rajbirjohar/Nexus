import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout/Layout'
import { LottieWrapper } from '@/components/LottieWrapper'
import styles from '@/styles/404.module.css'
import emptyAnimationData from '@/lotties/404-1.json'

export default function Custom404() {
  return (
    <Layout>
      <Head>
        <title>Nexus | 404</title>
        <link rel="icon" href="/NexusLogo.svg" />
      </Head>
      <section className={styles.hero}>
        <h1>Hmm... how did you get here?</h1>
        <p>
          It seems you tried to reach a page which does not exist. We recommend
          using pages that do exist 😄.
        </p>
        <Link href={'/'} passHref>
          <a>Go back home</a>
        </Link>
        <div className={styles.animationWrapper}>
          <LottieWrapper animationData={emptyAnimationData} />
        </div>
      </section>
    </Layout>
  )
}
