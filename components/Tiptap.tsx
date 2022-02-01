import React, { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import styles from '@/styles/form.module.css'
import CharacterCount from '@tiptap/extension-character-count'

const limit = 1000

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null
  }

  return (
    <nav className={styles.menubar}>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        <strong>B</strong>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        <i>I</i>
      </button>
      {/* Until I can figure out why underline won't work */}
      {/* <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <u>U</u>
      </button> */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'is-active' : ''}
      >
        <s>S</s>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={editor.isActive('code') ? 'is-active' : ''}
      >
        &lt;/&gt;
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor.isActive('paragraph') ? 'is-active' : ''}
      >
        Paragraph
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
      >
        Heading
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
      >
        Subheading
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
      >
        Subtitle
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
      >
        bullet
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'is-active' : ''}
      >
        ordered
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive('codeBlock') ? 'is-active' : ''}
      >
        &lt;/&gt; block
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'is-active' : ''}
      >
        quote
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        horizontal rule
      </button>
      <button type="button" onClick={() => editor.chain().focus().undo().run()}>
        undo
      </button>
      <button type="button" onClick={() => editor.chain().focus().redo().run()}>
        redo
      </button>
    </nav>
  )
}

const Tiptap = (props) => {
  const { setFieldValue, isSubmitting, name, oldEventDetails } = props
  let rawHtml =
    oldEventDetails ||
    `
  <h2>
    Hi there,
  </h2>
   <p>
   What do you want to share with the world today?
   </p>
`
  const editor = useEditor({
    extensions: [StarterKit, CharacterCount.configure({ limit })],
    content: rawHtml,
  })

  // Apparently fixes memory leak error
  useEffect(() => {
    if (isSubmitting) {
      rawHtml = editor.getHTML()
      setFieldValue(name, rawHtml)
    }
  })
  if (!editor) {
    return null
  }
  return (
    <div>
      <MenuBar editor={editor} />
      <div className={styles.editor}>
        <EditorContent editor={editor} name={name} />
      </div>
      <span className={styles.maxlength}>
        {editor.storage.characterCount.characters()}/{limit} characters
      </span>
    </div>
  )
}

export default Tiptap
