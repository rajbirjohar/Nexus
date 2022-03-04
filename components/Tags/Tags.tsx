import React, { useEffect, useState } from 'react'
import { WithContext as ReactTags } from 'react-tag-input'
import styles from './tags.module.css'

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
    id: 'generalmeeting',
    text: 'generalmeeting',
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
  const { setFieldValue, name, oldTags } = props
  // default value should be existing tags if they exist, otherwise, empty array
  const [tags, setTags] = useState(oldTags ? oldTags : [])

  // Update the values.count on Formik every time setTags
  // or tags change because useState does not update until
  // the next rerender so we need to be able to keep constant
  // track of this value otherwise users will be able to add
  // as many tags as they want
  useEffect(() => {
    setFieldValue(name, tags)
    // Supress warning for setFieldValue and name
    /* eslint-disable */
  }, [setTags, tags])

  const handleDelete = (i) => {
    setTags(tags.filter((tag, index) => index !== i))
    setFieldValue(name, tags)
  }

  const handleAddition = (tag) => {
    // convert to lowercase
    tag = Object.fromEntries(
      Object.entries(tag).map(([key, value]) => [
        key,
        value.toString().toLowerCase(),
      ])
    )
    setTags([...tags, tag])
    setFieldValue(name, tags)
  }

  const handleTagClick = (index) => {
    console.log('The tag at index ' + index + ' was clicked')
  }

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
          // tags: `${cardstyles.tagwrapper}`,
          tagInput: `${styles.taginputwrapper}`,
          tagInputField: `${styles.taginput}`,
          selected: `${styles.tagwrapper}`,
          tag: `${styles.tag}`,
          remove: `${styles.removetag}`,
          suggestions: `${styles.suggestions}`,
          activeSuggestion: `${styles.activesuggestion}`,
        }}
      />
    </div>
  )
}
