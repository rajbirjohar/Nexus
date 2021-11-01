import styles from '@/styles/reviewposts.module.css'

const Skeleton = () => {
  return (
    <div className={styles.card}>
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
      <Skeleton />
      <Skeleton />
    </>
  )
}
