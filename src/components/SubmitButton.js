import React from 'react'

function SubmitButton ({text, bgColor}) {
  return (
    <>
      {/* button to submit forms for prelim pages*/}
      <button type="submit" className="submit-button" style={bgColor && {background: bgColor}}>
        {text}
      </button>
    </>
  )
}

export default SubmitButton
