import styles from '@/styles/card.module.css'

// Component: Loader
// Params: none
// Purpose: To display a static loading state element
// while the data is being fetched so the UX is not broken

const Skeleton = () => {
  return (
    <div className={styles.dummycard}>
      <p className={styles.dummydescription}></p>
      <p className={styles.dummydescription}></p>
      <p className={styles.dummydescription}></p>
      <span className={styles.dummyauthor}>
        <p className={styles.dummytitle}></p>
      </span>
    </div>
  )
}

export default function Loader() {
  return (
    <>
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </>
  )
}
