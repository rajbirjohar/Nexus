import React from 'react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import cardstyles from '@/styles/card.module.css'
import formstyles from '@/styles/form.module.css'

// Component: ReviewPostCard({
// reviewee,
// reviewPost,
// reviewProfessor,
// course,
// taken,
// difficulty,
// timestamp,
// anonymous,
// reviewPostId,
// })
// Purpose: To display all data within a single review as a card

export default function ReviewPostCard({
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
  const { data: session } = useSession()

  const deleteReviewPost = async (event) => {
    const response = await fetch(`/api/reviewposts/reviewdelete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reviewPostData: courseId, reviewPostId }),
    })
    await response.json()
    if (response.status === 200) {
      toast.success('Deleted review.')
    } else {
      toast.error(
        'Uh oh. Something went wrong. If this persists, please let us know.'
      )
    }
  }

  return (
    <div className={cardstyles.card}>
      <div className={cardstyles.reviewheader}>
        <h3 className={cardstyles.coursetitle}>{course}</h3>
        <h3 className={cardstyles.difficulty}>{difficulty}</h3>
      </div>
      <p>
        <strong>Review:</strong> <br />
        <i>&quot;{reviewPost}&quot;</i>
      </p>
      <p>
        <strong>Professor:</strong> {reviewProfessor}
      </p>
      <p>
        <strong>Taken:</strong> {taken}
      </p>
      <p className={cardstyles.author}>
        <strong>Author: </strong>
        {anonymous === true ? <>Anonymous</> : <>{creator}</>} about {timestamp}
      </p>
      {session && session.user.id === creatorId && (
        <div className={formstyles.actions}>
          {/* <button className={styles.modify}>Modify</button> */}
          <button onClick={deleteReviewPost} className={formstyles.delete}>
            Delete
          </button>
        </div>
      )}
    </div>
  )
}
