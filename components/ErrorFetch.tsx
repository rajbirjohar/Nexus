import Image from 'next/image'
import formstyles from '@/styles/form.module.css'

const ErrorFetch = ({ placeholder }) => {
  return (
    <div className={formstyles.serverdown}>
      <p>
        Oops. Looks like {placeholder} are not being fetched right now. If this
        persists, please let us know.
      </p>
    </div>
  )
}

export default ErrorFetch
