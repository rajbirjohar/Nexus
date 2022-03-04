import useSWR from 'swr'
import fetcher from '@/lib/fetcher'
import ErrorFetch from '../../Layout/ErrorFetch'
import Comment from './Comment'
import styles from './comment.module.css'

export default function ListComments({ eventId, isAdmin }) {
  const { data, error } = useSWR(`/api/events/comments/${eventId}`, fetcher, {
    refreshInterval: 1000,
  })
  if (error) {
    return <ErrorFetch placeholder="comments" />
  }
  if (!data) {
    return <p>Loading comments...</p>
  }
  return (
    <div className={styles.comments}>
      {data.comments.length === 0 && <p>Write the first comment!</p>}
      {data.comments.map((comment) => (
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
    </div>
  )
}
