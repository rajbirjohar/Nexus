import React, { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import styles from '@/styles/form.module.css'
import CharacterCount from '@tiptap/extension-character-count'
import {
  CodeIcon,
  DividerHorizontalIcon,
  FontBoldIcon,
  FontItalicIcon,
  HeadingIcon,
  ListBulletIcon,
  PilcrowIcon,
  QuoteIcon,
  ResetIcon,
  StrikethroughIcon,
  TextAlignJustifyIcon,
  UnderlineIcon,
} from '@radix-ui/react-icons'
import Underline from '@tiptap/extension-underline'

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
        <FontBoldIcon />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        <FontItalicIcon />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive('underline') ? 'is-active' : ''}
      >
        <UnderlineIcon />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'is-active' : ''}
      >
        <StrikethroughIcon />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={editor.isActive('code') ? 'is-active' : ''}
      >
        <CodeIcon />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor.isActive('paragraph') ? 'is-active' : ''}
      >
        <PilcrowIcon />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
      >
        <HeadingIcon />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
      >
        <ListBulletIcon />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'is-active' : ''}
      >
        123
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive('codeBlock') ? 'is-active' : ''}
      >
        <CodeIcon />
        <TextAlignJustifyIcon />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'is-active' : ''}
      >
        <QuoteIcon />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <DividerHorizontalIcon />
      </button>
      <button type="button" onClick={() => editor.chain().focus().undo().run()}>
        <ResetIcon />
      </button>
    </nav>
  )
}

const Tiptap = (props) => {
  const { setFieldValue, isSubmitting, name, oldEventDetails } = props
  let rawHtml =
    oldEventDetails ||
    `
  <h3>
    Hi there,
  </h3>
   <p>
   What do you want to share with the world today?
   </p>
`
  const editor = useEditor({
    extensions: [StarterKit, CharacterCount.configure({ limit }), Underline],
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
