import cardstyles from '@/styles/card.module.css'

const listItems = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
}

export default function RecentReviewPostCard({
  creator,
  creatorEmail,
  creatorId,
  reviewPost,
  reviewProfessor,
  course,
  courseId,
  taken,
  difficulty,
  timestamp,
  anonymous,
  reviewPostId,
}) {
  return (
    <div className={cardstyles.reviewcard}>
      <span className={cardstyles.reviewheader}>
        <h3 className={cardstyles.coursetitle}>{course}</h3>
        <h3 className={cardstyles.difficulty}>{difficulty}</h3>
      </span>
      <div>
        <strong>Review:</strong> <br />
        <div dangerouslySetInnerHTML={{ __html: `${reviewPost}` }} />
        <p>
          <strong>Professor:</strong> {reviewProfessor}
        </p>
        <p>
          <strong>Taken:</strong> {taken}
        </p>
        <p className={cardstyles.author}>
          <strong>Author: </strong>
          {anonymous === true ? <>Anonymous</> : <>{creator}</>} about{' '}
          {timestamp}
        </p>
      </div>
    </div>
  )
}
