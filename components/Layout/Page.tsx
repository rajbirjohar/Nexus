import Head from 'next/head'
import Layout from '@/components/Layout/Layout'
import Sidebar from '@/components/Layout/Sidebar'
import styles from '@/styles/layout.module.css'
import { motion } from 'framer-motion'

interface Props {
  title: string
  children: React.ReactNode | React.ReactNode[]
  tip: React.ReactNode | React.ReactNode[] | null
}

export default function Page({ title, children, tip }: Props) {
  return (
    <Layout>
      <Head>
        <title>Nexus {title && '| ' + title}</title>
        <link rel="icon" href="/NexusLogo.svg" />
      </Head>
      <section className={styles.page}>
        <section>{children}</section>
        <section>
          {tip}
          <Sidebar />
        </section>
      </section>
    </Layout>
  )
}
