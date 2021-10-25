import React, { useEffect, useRef, useState } from 'react'

const useSlider = (min, max, defaultState, label, id) => {
  const [slide, setSlide] = useState(defaultState)
  const handleChange = (event) => {
    console.log('setting level', event.target.value)
    setSlide(event.target.value)
  }

  const Slider = () => (
    <>
      <label htmlFor="_difficulty">
        <strong>!! IMPT: Slider sets the previous value</strong>
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
        onMouseUp={handleChange} // only set state when handle is released
      />
    </>
  )
  return [slide, Slider, setSlide]
}

export default useSlider
