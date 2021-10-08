import { useTheme } from 'next-themes'
import styles from '@/styles/header.module.css'

const ThemeChanger = () => {
  const { theme, setTheme } = useTheme()

  return (
    <div>
      <button onClick={() => setTheme('light')}>Light Mode</button>
      <button onClick={() => setTheme('dark')}>Dark Mode</button>
    </div>
  )
}

export default ThemeChanger
