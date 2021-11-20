import Head from 'next/head'
import Image from 'next/image'
import Layout from '../components/Layout'
import styles from '@/styles/404.module.css'

export default function Disclaimers() {
  return (
    <Layout>
      <Head>
        <title>Nexus | Disclaimers</title>
      </Head>
      <h1>DISCLAIMERS</h1>
      <h3>Last updated November 19, 2021</h3>
      <h2>WEBSITE DISCLAIMER</h2>
      <p>
          The information provided by Nexus ("we," "us", or "our") on nexus-ucr.vercel.app (the
          "Site") is for general informational purposes only. All information on the Site is
          provided in good faith; however, we make no representation or warranty of any kind,
          express or implied, regarding the accuracy, adequacy, validity, reliability, availability
          or completeness of any information on the Site. UNDER NO CIRCUMSTANCE SHALL WE HAVE
          ANY LIABILITY TO YOU FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE
          USE OF THE SITE OR RELIANCE ON ANY INFORMATION PROVIDED ON THE SITE. YOUR USE OF
          THE SITE AND YOUR RELIANCE ON ANY INFORMATION ON THE SITE IS SOLELY AT YOUR OWN RISK.
      </p>
      <h2>TESTIMONIALS DISCLAIMER</h2>
      <p>
          The Site may contain testimonials by users of our products and/or services. These
          testimonials reflect the real-life experiences and opinions of such users. However, the
          experiences are personal to those partiular users, and may not necessarily be
          representative of all users of our products and/or services. We do not claim, and you
          should not assume, that all users will have the same experiences. YOUR INDIVIDUAL RESULTS
          MAY VARY.
      </p>
      <p>
          The testimonials on the Site are submitted in text and are not reviewed by us before
          being posted. They appear on the Site verbatim as given by the users.
      </p>
      <p>
          The views and opinions contained in the testimonials belong solely to the individual
          user and do not reflect our views and opinions. We are not affiliated with users who
          provide testimonials, and users are not paid or otherwise compensated for their testimonials.
      </p>
    </Layout>
  )
}