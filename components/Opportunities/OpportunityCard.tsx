import { format } from 'date-fns'
import Link from 'next/link'
import styles from 'components/Events/card.module.css'
import { useSession } from 'next-auth/react'
import React, { useState, useEffect, useRef } from 'react'
import { EditIcon, TrashIcon } from '../Icons'
import formstyles from '@/styles/form.module.css'
import { AnimatePresence, motion } from 'framer-motion'
import toast from 'react-hot-toast'
import OpportunityEditForm from './OpportunityEditForm'

const deleteTextWrapper = {
  closed: {
    width: '0',
    transition: {
      when: 'afterChildren',
    },
  },
  open: {
    width: 'auto',
  },
}

const deleteText = {
  closed: {
    opacity: 0,
    transition: {
      duration: 0.15,
    },
  },
  open: {
    opacity: 1,
    transition: {
      delay: 0.15,
    },
  },
}

export default function OpportunityCard({
  opId,
  authorId,
  author,
  email,
  name,
  details,
  endDate,
  tags,
} : Opportunity) {
  const { data: session } = useSession()
  const [isEdit, setIsEdit] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  const wrapperRef = useRef(null)
  useEffect(() => {
    document.addEventListener('click', handleClickOutside, false)
    return () => {
      document.removeEventListener('click', handleClickOutside, false)
    }
  }, [])
  const handleClickOutside = (opportunity) => {
    if (
      wrapperRef.current &&
      !wrapperRef.current.contains(opportunity.target)
    ) {
      setIsDelete(false)
    }
  }
  const confirmDelete = (opportunity) => {
    if (isDelete === true) {
      deleteOpportunityPost()
    } else {
      setIsDelete(true)
    }
  }
  async function deleteOpportunityPost() {
    const response = await fetch(`/api/opportunities`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newOpportunityData: opId, authorId }),
    })
    await response.json()
    if (response.status === 200) {
      toast.success('Deleted opportunity.')
    } else {
      toast.error(
        'Uh oh. Something went wrong. If this persists, please let us know.'
      )
    }
  }
  // To remove all markdown tags from the details sections
  const strippedOpportunityDetails = details.replace(/(<([^>]+)>)/gi, ' ')
  const [endMonth, endDay, endYear, endHour] = [
    format(new Date(endDate), 'MMM'),
    format(new Date(endDate), 'd'),
    format(new Date(endDate), 'yyyy'),
    format(new Date(endDate), 'hh:mm aaa'),
  ]
  return (
    <div id={authorId} className={styles.opportunitycard}>
      {isEdit ? (
        <OpportunityEditForm
          authorId={authorId}
          opId={opId}
          author={author}
          email={email}
          name={name}
          details={details}
          endDate={endDate}
          tags={tags}
          setIsEdit={setIsEdit}
          isEdit={isEdit}
        />
      ) : (
        <div>
          <span className={styles.header}>
            <h3 className={styles.title}>{name}</h3>
            <p className={styles.author}>
              <strong>
                By {author} {'- '} {email}{' '}
              </strong>
            </p>
          </span>

          <time className={styles.date}>
            {'Application Due:'} {endMonth} {endDay} {endHour}
          </time>

          <div dangerouslySetInnerHTML={{ __html: `${details}` }} />

          {tags && (
            <div className={styles.tagwrapper}>
              {tags.map((tag) => (
                <span key={tag.id} className={styles.tag}>
                  {tag.text}
                </span>
              ))}
            </div>
          )}

          {session && session.user.id === authorId && (
            <div className={formstyles.actions}>
              <button
                onClick={confirmDelete}
                className={formstyles.delete}
                ref={wrapperRef}
              >
                <TrashIcon />
                <AnimatePresence exitBeforeEnter>
                  {isDelete && (
                    <motion.span
                      variants={deleteTextWrapper}
                      animate={isDelete ? 'open' : 'closed'}
                      initial="closed"
                      exit="closed"
                    >
                      <motion.span variants={deleteText}>Confirm</motion.span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <button
                onClick={() => {
                  setIsEdit(!isEdit)
                }}
                className={formstyles.edit}
              >
                <EditIcon />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
