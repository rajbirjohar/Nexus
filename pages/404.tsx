import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import Layout from '../components/Layout'
import Lottie, { useLottie } from 'lottie-react'
import styles from '@/styles/404.module.css'
import emptyAnimationData from '../lotties/404-1.json'

const style = {
  height: 500,
  width: '100%',
}

export default function Custom404() {
  return (
    <Layout>
      <Head>
        <title>Nexus | 404</title>
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
        <div className={styles.animationWrapperSmall}>
          <Lottie
            animationData={emptyAnimationData}
            style={style}
            renderer="canvas"
          />
        </div>
      </section>
    </Layout>
  )
}
