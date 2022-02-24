// To disable the warning for next/image for the thumbnail
// since next/image is broken when it comes to aspect ratio
/* eslint @next/next/no-img-element: 0 */

import React, { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import styles from './dropzone.module.css'
import { PhotoIcon } from '../Icons'

export default function ImageDropzone(props) {
  const { setFieldValue, name } = props
  const [file, setFile] = useState([])
  const [error, setError] = useState('')
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/png, image/jpeg, image/jpg',
    multiple: false,
    maxSize: 1000000, // 1MB because we are poor
    onDrop: (acceptedFiles, fileRejections) => {
      // If the file fails any of the requirements, run
      fileRejections.map((file) => {
        setFile([])
        file.errors.map((err) => {
          if (err.code === 'file-too-large') {
            setError('Error: File is greater than 1MB')
          }
          if (err.code === 'file-invalid-type') {
            setError('Error: File must be png or jpeg only')
          }
        })
      })
      // Else generate preview URL and imageData for submission
      acceptedFiles.map((file) => {
        setError('')
        setFile(
          acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          )
        )
        const reader = new FileReader()
        // Need to pass in acceptedFiles instead of file
        reader.readAsDataURL(acceptedFiles[0])
        reader.onabort = () => console.log('file reading was aborted')
        reader.onerror = () => console.log('file reading has failed')
        reader.onload = () => {
          // Extract base64 string from 'result' property
          const imageData = reader.result
          setFieldValue(name, imageData)
        }
      })
    },
  })
  const thumbs = file.map((file) => (
    <div className={styles.thumb} key={file.name}>
      <div className={styles.thumbInner}>
        <button
          className={styles.delete}
          onClick={() => {
            setFile([])
            setFieldValue(name, '')
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <img src={file.preview} className={styles.img} alt="Thumbnail" />
      </div>
    </div>
  ))
  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks
    file.forEach((file) => URL.revokeObjectURL(file.preview))
  }, [file])
  return (
    <div className={styles.dropzone}>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <p className={styles.prompt}>
          <PhotoIcon />
          <br />
          Drop a cool picture or click to add one <br />
          <i>(.png or .jpeg only please!)</i> <br />
          <span className={styles.error}>{error}</span>
        </p>
      </div>
      <aside className={styles.thumbsContainer}>{thumbs}</aside>
    </div>
  )
}
