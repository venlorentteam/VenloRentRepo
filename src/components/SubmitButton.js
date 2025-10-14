import React from 'react'
import { useNavigate } from 'react-router-dom'

export const SubmitButton = ({text, bgColor}) => {
  return (
    <>
      {/* button to submit forms for prelim pages*/}
      <button type="submit" className="submit-button" style={bgColor && {background: bgColor}}>
        {text}
      </button>
    </>
  )
}
