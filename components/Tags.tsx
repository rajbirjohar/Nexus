import React, { useEffect, useState } from 'react'
import { WithContext as ReactTags } from 'react-tag-input'
import cardstyles from '@/styles/card.module.css'

const suggestions = [
  {
    id: 'social',
    text: 'social',
  },
  {
    id: 'jobs',
    text: 'jobs',
  },
  {
    id: 'general meeting',
    text: 'general meeting',
  },
  {
    id: 'internship',
    text: 'internship',
  },
  {
    id: 'hackathon',
    text: 'hackathon',
  },
]

const KeyCodes = {
  comma: 188,
  enter: 13,
}

const delimiters = [KeyCodes.enter]

export default function Tags(props) {
  const { setFieldValue, isSubmitting, name, oldEventTags } = props
  const [tags, setTags] = useState(oldEventTags ? oldEventTags : [])

  // Update the values.count on Formik every time setTags
  // or tags change because useState does not update until
  // the next rerender so we need to be able to keep constant
  // track of this value otherwise users will be able to add
  // as many tags as they want
  useEffect(() => {
    setFieldValue(name, tags)
  }, [setTags, tags])

  const handleDelete = (i) => {
    setTags(tags.filter((tag, index) => index !== i))
  }

  const handleAddition = (tag) => {
    setTags([...tags, tag])
    setFieldValue(name, tags)
  }

  const handleTagClick = (index) => {
    console.log('The tag at index ' + index + ' was clicked')
  }

  useEffect(() => {
    if (isSubmitting) {
      setFieldValue(name, tags)
    }
  })

  return (
    <div>
      <ReactTags
        name={name}
        tags={tags}
        suggestions={suggestions}
        delimiters={delimiters}
        handleDelete={handleDelete}
        handleAddition={handleAddition}
        handleTagClick={handleTagClick}
        maxLength={20}
        allowUnique
        allowDragDrop={false}
        inputFieldPosition="top"
        autocomplete={false}
        autofocus={false}
        classNames={{
          // tags: ,
          tagInput: `${cardstyles.taginputwrapper}`,
          tagInputField: `${cardstyles.taginput}`,
          selected: `${cardstyles.tagwrapper}`,
          tag: `${cardstyles.tag}`,
          remove: `${cardstyles.removetag}`,
          suggestions: `${cardstyles.suggestions}`,
          activeSuggestion: `${cardstyles.activesuggestion}`
        }}
      />
    </div>
  )
}
