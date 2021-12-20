import formstyles from '@/styles/form.module.css'
import Image from 'next/image'

const NotFound = ({ placeholder }) => {
  return (
    <div className={formstyles.notFound}>
      <h3>Woah There.</h3>
      <p>
        What!? That&#39;s crazy. It seems this {placeholder} does not yet exist.
        <br />
        <cite>— Robert</cite>
      </p>
      <Image
        src={'/assets/void.svg'}
        width={200}
        height={200}
        alt="Nothing Found Image"
      />
    </div>
  )
}

export default NotFound
