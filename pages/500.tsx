import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import Layout from '../components/Layout'
import Lottie from 'react-lottie'
import styles from '@/styles/404.module.css'
import emptyAnimationData from '../lotties/404-1.json'

const LottieWrapper = ({ animationData }) => {
  const heroOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }
  return <Lottie options={heroOptions} height="100%" width="100%" />
}

export default function Custom500() {
  return (
    <Layout>
      <Head>
        <title>Nexus | 500</title>
      </Head>
      <h1>Hmm... how did you get here?</h1>
      <p>
        It seems you tried to reach a page which does not exist{' '}
        <i>on our backend</i>. We recommend using pages that do exist 😄.
      </p>
      <Link href={'/'} passHref>
        <a>Go back home</a>
      </Link>
      <div className={styles.animationWrapper}>
        <LottieWrapper animationData={emptyAnimationData} />
      </div>
    </Layout>
  )
}
