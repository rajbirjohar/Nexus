import styles from '@/styles/card.module.css'

const Comment = ({ comment, author, date }) => {
  return (
    <div>
      <p>{comment}</p>
      <span className={styles.authorlabel}>
        {author} about {date}
      </span>
    </div>
  )
}

export default Comment
