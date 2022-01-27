import formstyles from '@/styles/form.module.css'
import { motion } from 'framer-motion'

const NotFound = ({ placeholder }) => {
  return (
    <motion.div layout="position" className={formstyles.notFound}>
      <h3>Woah There.</h3>
      <p>
        What!? That&#39;s crazy. It seems this {placeholder} does not yet exist.
        <br />
        <cite>— Robert</cite>
      </p>
    </motion.div>
  )
}

export default NotFound
