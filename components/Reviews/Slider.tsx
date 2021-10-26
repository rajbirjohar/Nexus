import React, { useEffect, useRef, useState } from 'react'
import styles from '@/styles/reviewposts.module.css'

const useSlider = (min, max, defaultState, label, id) => {
  const [slide, setSlide] = useState(defaultState)

  // const handleSliderChange = (event) => {
  //   console.log('handleSliderChange:', event.target.value)
  //   currentValue = event.target.value
  //   setSlide(event.target.value)
  // }

  useEffect(() => {
    setSlide(slide)
    console.log('useSlider:', slide)
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
            defaultValue={slide} // but instead pass state value as default value
            onChange={(e) => console.log(e.target.value)} // don't set state on all change as react will re-render
            onMouseUp={props['onHandleChange']}
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
