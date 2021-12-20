import Image from 'next/image'
import formstyles from '@/styles/form.module.css'

const ErrorFetch = ({ placeholder }) => {
  return (
    <div className={formstyles.serverdown}>
      <p>
        Oops. Looks like {placeholder} are not being fetched right now. If this
        persists, please let us know.
      </p>
      <Image
        src={'/assets/server.svg'}
        height={500}
        width={500}
        alt="Server Down Image"
      />
    </div>
  )
}

export default ErrorFetch
