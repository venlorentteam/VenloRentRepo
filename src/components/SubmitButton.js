import React from 'react'
import "./SubmitButton.css"

function SubmitButton({ text, bgColor, disabled, onClick, isLoading }) {
  return (
    <button 
      type="submit" 
      className={`submit-button ${disabled || isLoading ? "disabled" : ""}`} 
      style={bgColor ? { background: bgColor } : undefined}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {isLoading ? (
        <>
          <span className="button-spinner"></span>
          <span>Loading...</span>
        </>
      ) : (
        text
      )}
    </button>
  )
}

export default SubmitButton