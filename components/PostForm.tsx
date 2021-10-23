import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import styles from '@/styles/form.module.css'

export default function PostForm(props) {
  const [entry, setEntry] = useState('')
  const { data: session, status } = useSession()

  const [filled] = useState({
    entry: false,
    name: '',
    email: '',
  })
  const handleChangeEntry = (e) => {
    setEntry(e.target.value)
    filled.entry = e.target.value !== ''
    filled.name = session.user.name
    filled.email = session.user.email
  }
  const submitForm = (name, email) => {
    if (Object.values(filled).every((e) => e)) {
      const data = [name, email, entry]
      sendData(data)
      toast.success('Awesome. You signed!', {
        icon: '👏',
      })
    } else {
      toast.error('Please fill out your message.')
    }
    setEntry('')
  }

  const sendData = async (entryData) => {
    const response = await fetch('/api/posts/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ entry_data: entryData }),
    })
    const data = await response.json()
    return data.entry_data
  }

  return (
    <form onSubmit={(e) => e.preventDefault()} className={styles.inputWrapper}>
      <input
        aria-label="Entry Input"
        name="Entry"
        value={entry}
        onChange={handleChangeEntry}
        type="text"
        placeholder="Your entry here..."
        className={styles.input}
      />
      <button
        className={styles.signbutton}
        type="submit"
        onClick={() => submitForm(props.name, props.email)}
      >
        Post
      </button>
    </form>
  )
}
