import React, { useEffect, useRef, useState } from 'react'
import { Field } from 'formik'
import styles from '@/styles/form.module.css'

// Hook: useSlider(min, max, defaultState, label, id)
// Params: min, max, defaultState, label, id
// Croseit: To Jason

const useSlider = (min, max, defaultState) => {
  const [slide, setSlide] = useState(defaultState)

  useEffect(() => {
    setSlide(slide)
  }, [setSlide, slide])

  const Slider = (props) => {
    return (
      <div className={styles.slider}>
        <Field
          autoComplete="off"
          type="range"
          name="difficulty"
          id="difficulty"
          min={min}
          max={max}
          step={1}
          // but instead pass state value as default value
          defaultValue={slide}
          // don't set state on all change as react will re-render
          onMouseUp={props['onHandleChange']}
          onTouchEnd={props['onHandleChange']}
        />
        <div className={styles.sliderlabel}>
          <span>1</span>
          <span>10</span>
        </div>
      </div>
    )
  }
  return [slide, Slider, setSlide]
}

export default useSlider
