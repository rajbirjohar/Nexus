import React, { useState } from 'react'
import styles from '@/styles/layout.module.css'
import { motion, AnimatePresence } from 'framer-motion'

export default function Tabs({ tabs, layoutId }) {
  const initialTabs = tabs
  const [selectedTab, setSelectedTab] = useState(initialTabs[0])
  return (
    <>
      <nav className={styles.tabs}>
        {initialTabs.map((item) => (
          <motion.button
            key={item.label}
            className={
              item.id === selectedTab.id
                ? `${styles.active} ${styles.tab}`
                : ` ${styles.tab}`
            }
            onClick={() => setSelectedTab(item)}
          >
            {item.label}
            {item.id === selectedTab.id ? (
              <motion.div className={styles.underline} layoutId={layoutId} />
            ) : null}
          </motion.button>
        ))}
      </nav>
      <section>
        <AnimatePresence exitBeforeEnter>
          <motion.div
            key={selectedTab ? selectedTab.label : 'empty'}
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, type: 'tween' }}
          >
            <h2>{selectedTab.label}</h2>
            {selectedTab ? selectedTab.component : 'Nothing to see here.'}
          </motion.div>
        </AnimatePresence>
      </section>
    </>
  )
}
