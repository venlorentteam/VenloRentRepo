import React from 'react'
import "./SubmitButton.css"
function SubmitButton ({text, bgColor, disabled, onClick}) {
  return (
    <>
      {/* button to submit forms for prelim pages*/}
      <button type="submit" className={`submit-button ${disabled ? "disabled" : ""}`} style={bgColor && {background: bgColor}} disabled={disabled}>
        {text}
      </button>
    </>
  )
}

export default SubmitButton
