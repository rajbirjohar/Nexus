import Head from 'next/head'
import Layout from '../components/Layout/Layout'
import styles from '@/styles/about.module.css'

export default function Disclaimers() {
  return (
    <Layout>
      <Head>
        <title>Nexus | Disclaimers</title>
        <link rel="icon" href="/NexusLogo.svg" />
      </Head>
      <section className={styles.content}>
        <h1>DISCLAIMERS</h1>
        <h3>Last updated November 19, 2021</h3>
        <h2>WEBSITE DISCLAIMER</h2>
        <p>
          The information provided by Nexus (&#34;we,&#34; &#34;us&#34;, or
          &#34;our&#34;) on nexus-ucr.vercel.app (the &#34;Site&#34;) is for
          general informational purposes only. All information on the Site is
          provided in good faith; however, we make no representation or warranty
          of any kind, express or implied, regarding the accuracy, adequacy,
          validity, reliability, availability or completeness of any information
          on the Site. UNDER NO CIRCUMSTANCE SHALL WE HAVE ANY LIABILITY TO YOU
          FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF
          THE SITE OR RELIANCE ON ANY INFORMATION PROVIDED ON THE SITE. YOUR USE
          OF THE SITE AND YOUR RELIANCE ON ANY INFORMATION ON THE SITE IS SOLELY
          AT YOUR OWN RISK.
        </p>
        <h2>TESTIMONIALS DISCLAIMER</h2>
        <p>
          The Site may contain testimonials by users of our products and/or
          services. These testimonials reflect the real-life experiences and
          opinions of such users. However, the experiences are personal to those
          particular users, and may not necessarily be representative of all
          users of our products and/or services. We do not claim, and you should
          not assume, that all users will have the same experiences. YOUR
          INDIVIDUAL RESULTS MAY VARY.
        </p>
        <p>
          The testimonials on the Site are submitted in text and are not
          reviewed by us before being posted. They appear on the Site verbatim
          as given by the users.
        </p>
        <p>
          The views and opinions contained in the testimonials belong solely to
          the individual user and do not reflect our views and opinions. We are
          not affiliated with users who provide testimonials, and users are not
          paid or otherwise compensated for their testimonials.
        </p>
        <h2>A Word from the Team</h2>
        <p>Hey folks 😄. We&#39;re glad you&#39;re here.</p>
        <p>
          Nexus&#39; sole and only purpose is to provide a space where students
          can contribute and learn from other students&#39; experiences. We hope
          that you share the same sentiment as we do.
        </p>
        <p>
          Having said that, we want to stress that we are here for a good time
          and do not want to promote any harrassment or flaming of any
          individual or group of people regardless of position.
        </p>
        <p>
          We hope to create an inclusive and welcoming environment where you can
          enjoy the super clean animations and great color theme (and dark mode
          ✨).
        </p>
        <p>
          Feel free to message one or all of us and we would be happy to have a
          chat. You can check me personally out at{' '}
          <a
            rel="noopener noreferrer"
            href="https://rajbir.io/"
            target="_blank"
          >
            my Portfolio
          </a>
          .
        </p>
        <cite>— Rajbir Johar</cite>
      </section>
    </Layout>
  )
}
