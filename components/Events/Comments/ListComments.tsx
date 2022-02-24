import useSWR from 'swr'
import fetcher from '@/lib/fetcher'
import ErrorFetch from '../../Layout/ErrorFetch'
import Comment from './Comment'
import TimeAgo from 'react-timeago'
import styles from './comment.module.css'

export default function ListComments({ eventId, organizationId }) {
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
          key={comment.commentId}
          organizationId={organizationId}
          eventId={eventId}
          commentId={comment.commentId}
          comment={comment.comment}
          authorId={comment.authorId}
          author={comment.author}
          date={<TimeAgo date={comment.createdAt} />}
        />
      ))}
    </div>
  )
}
