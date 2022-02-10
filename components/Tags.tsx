import React, { useEffect, useState } from 'react'
import { WithContext as ReactTags } from 'react-tag-input'

const KeyCodes = {
  comma: 188,
  enter: 13,
}

const delimiters = [KeyCodes.enter]

export default function Tags(props) {
  const { setFieldValue, isSubmitting, name, oldEventTags } = props
  const [tags, setTags] = useState(oldEventTags ? oldEventTags : [])
  const handleDelete = (i) => {
    setTags(tags.filter((tag, index) => index !== i))
  }

  const handleAddition = (tag) => {
    setTags([...tags, tag])
  }

  // Disabled drag and drop
  const handleDrag = (tag, currPos, newPos) => {
    const newTags = tags.slice()
    newTags.splice(currPos, 1)
    newTags.splice(newPos, 0, tag)
    // re-render
    setTags(newTags)
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
        delimiters={delimiters}
        handleDelete={handleDelete}
        handleAddition={handleAddition}
        handleDrag={handleDrag}
        handleTagClick={handleTagClick}
        maxLength={20}
        allowUnique
        allowDragDrop={false}
        inputFieldPosition="top"
      />
    </div>
  )
}
