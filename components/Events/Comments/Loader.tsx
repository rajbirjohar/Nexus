import styles from './comment.module.css'

const Skeleton = () => {
  return (
    <div className={styles.skeleton}>
      <p className={styles.dummydescription}></p>
      <p className={styles.dummyauthor}>
        <span className={styles.dummytitle}></span>
      </p>
    </div>
  )
}

const Loader = () => {
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

export default Loader