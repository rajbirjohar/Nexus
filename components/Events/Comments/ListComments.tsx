import Comment from './Comment'
import styles from './comment.module.css'
import { useCommentPages } from 'hooks/useCommentPages'
import Loader from './Loader'

export default function ListComments({ eventId, isAdmin }) {
  const { data, size, setSize, isLoadingMore, isReachingEnd } = useCommentPages(
    { eventId: eventId }
  )
  const comments = data
    ? data.reduce((acc, val) => [...acc, ...val.comments], [])
    : []

  return (
    <div>
      {comments.map((comment) => (
        <Comment
          key={comment._id}
          eventId={eventId}
          commentId={comment._id}
          comment={comment.comment}
          authorId={comment.authorId}
          author={comment.author}
          isAdmin={isAdmin}
          date={comment.createdAt}
        />
      ))}
      {isLoadingMore ? (
        <Loader />
      ): isReachingEnd ? (
        <p className={styles.end}>You&#39;ve reached the end 🎉</p>
      ) : (
        <span className={styles.load}>
          <button disabled={isLoadingMore} onClick={() => setSize(size + 1)}>
            Load more
          </button>
        </span>
      )}
    </div>
  )
}
