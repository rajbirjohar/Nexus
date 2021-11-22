import React, { useEffect, useRef, useState } from 'react'
import styles from '@/styles/form.module.css'

// Hook: useSlider(min, max, defaultState, label, id)
// Params: min, max, defaultState, label, id
// Credit: To Jason

const useSlider = (min, max, defaultState, label, id) => {
  const [slide, setSlide] = useState(defaultState)

  useEffect(() => {
    setSlide(slide)
  }, [setSlide, slide])

  const Slider = (props) => {
    return (
      <div className={styles.slideWrapper}>
        <label htmlFor="_difficulty">
          <br />
          <strong>
            {label} {slide}
          </strong>
        </label>
        <div className={styles.labelWrapper}>
          <span>
            <strong>1</strong>
          </span>
          <input
            type="range"
            name="_difficulty"
            className={styles.slider}
            id={id}
            min={min}
            max={max}
            step={1}
            // but instead pass state value as default value
            defaultValue={slide}
            // don't set state on all change as react will re-render
            onMouseUp={props['onHandleChange']}
            onTouchEnd={props['onHandleChange']}
          />
          <span>
            <strong>10</strong>
          </span>
        </div>
      </div>
    )
  }
  return [slide, Slider, setSlide]
}

export default useSlider
