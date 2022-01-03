import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useDropzone } from 'react-dropzone'
import formstyles from '@/styles/form.module.css'

export default function ImageDropzone(props) {
  const { setFieldValue } = props
  const [files, setFiles] = useState([])
  const [errors, setErrors] = useState('')
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/jpeg, image/png',
    multiple: false,
    maxFiles: 1,
    maxSize: 2000000,
    onDrop: (acceptedFiles, fileRejections) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      )
      fileRejections.map((file) => {
        setFiles([])
        file.errors.map((err) => {
          if (err.code === 'file-too-large') {
            setErrors(`Error: File is greater than 2MB`)
          }
          if (err.code === 'file-invalid-type') {
            setErrors(`Error: ${err.message}`)
          }
        })
      })
      acceptedFiles.map(() => {
        setErrors('')
        const reader = new FileReader()
        reader.onabort = () => console.log('file reading was aborted')
        reader.onerror = () => console.log('file reading has failed')
        reader.onload = () => {
          // Do whatever you want with the file contents
          const imageData = reader.result
          setFieldValue('_image', imageData)
        }
        reader.readAsDataURL(acceptedFiles[0])
      })
    },
  })
  const thumbs = files.map((file) => (
    <div className={formstyles.thumb} key={file.name}>
      <div className={formstyles.thumbInner}>
        <button
          className={formstyles.imagedeleteicon}
          onClick={() => {
            setFiles([])
            setFieldValue('_image', '')
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
        <img src={file.preview} className={formstyles.img} />
      </div>
    </div>
  ))
  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach((file) => URL.revokeObjectURL(file.preview))
  }, [files])
  return (
    <div className={formstyles.dropzone}>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <p className={formstyles.prompt}>
          Drop a cool picture or click to add one <br />
          <i>(.png or .jpeg only please!)</i> <br />
          <span className={formstyles.error}>{errors}</span>
        </p>
      </div>
      <aside className={formstyles.thumbsContainer}>{thumbs}</aside>
    </div>
  )
}
