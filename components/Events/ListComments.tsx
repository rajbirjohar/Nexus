import useSWR from 'swr'
import Link from 'next/link'
import fetcher from '@/lib/fetcher'
import TimeAgo from 'react-timeago'
import Comment from './Comment'

export default function ListComments({ eventId }) {
  const { data, error } = useSWR(`/api/events/comments/${eventId}`, fetcher, {
    refreshInterval: 1000,
  })
  if (error) {
    return (
      <p>
        Oops. Looks like the comments are not being fetched right now. If this
        persists, please let us know.
      </p>
    )
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
          comment={comment.comment}
          author={comment.author}
          date={<TimeAgo date={comment.createdAt} />}
        />
      ))}
    </div>
  )
}
