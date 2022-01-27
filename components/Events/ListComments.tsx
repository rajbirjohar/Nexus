import useSWR from 'swr'
import fetcher from '@/lib/fetcher'
import ErrorFetch from '../Layout/ErrorFetch'
import Comment from './Comment'
import TimeAgo from 'react-timeago'

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
    <div>
      {data.comments.length === 0 && <p>Write the first comment!</p>}
      {data.comments.map((comment) => (
        <Comment
          key={comment._id}
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
