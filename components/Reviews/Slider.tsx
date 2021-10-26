import React, { useEffect, useRef, useState } from 'react'

const useSlider = (min, max, defaultState, label, id) => {
  const [slide, setSlide] = useState(defaultState)

  const handleSliderChange = (event) => {
    console.log('handleSliderChange:', event.target.value)
    setSlide(event.target.value)
  }

  useEffect(() => {
    setSlide(slide)
    console.log('useSlider:', slide)
  }, [setSlide, slide])

  const Slider = (props) => {
    return (
      <>
        <label htmlFor="_difficulty">
          <br />
          <strong>
            {label} {slide}
          </strong>
        </label>
        <input
          type="range"
          name="_difficulty"
          id={id}
          min={min}
          max={max}
          step={1}
          defaultValue={slide} // but instead pass state value as default value
          onChange={(e) => console.log(e.target.value)} // don't set state on all change as react will re-render
          // onMouseUp={handleSliderChange} // only set state when handle is released
          onMouseUp={props['onHandleChange']}
        />
      </>
    )
  }
  return [slide, Slider, setSlide]
}

export default useSlider
