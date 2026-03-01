import React, { useState, useRef, useEffect } from 'react'
import { SubmitButton } from '../exports'
import './OtpInput.css'

function OtpInput({ length = 6, onSubmit }) {
  const [otp, setOtp] = useState(Array(length).fill(""))
  const [errors, setErrors] = useState("")
  const inputsRef = useRef([])

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus()
    }
  }, [])

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return // Only digits allowed

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Clear error when user starts typing
    if (errors) setErrors("")

    // Move to next input automatically
    if (value && index < length - 1) {
      inputsRef.current[index + 1].focus()
    }
  }
  // Handle backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Move to previous input
        inputsRef.current[index - 1].focus()
      } else {
        // Clear current input
        const newOtp = [...otp]
        newOtp[index] = ""
        setOtp(newOtp)
      }
    }
  }

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData
    .getData("Text")
    .replace(/\D/g, "") // Remove non-digits
    .slice(0, length)
    .split("")
    const newOtp = [...otp]
    pastedData.forEach((char, i) => {
      if (i < length) {
        newOtp[i] = char
      }
    })
    setOtp(newOtp)

    // Focus last filled input
    const lastFilledIndex = Math.min(pastedData.length, length - 1)
    inputsRef.current[lastFilledIndex]?.focus()
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    const code = otp.join("")
    if (!code.trim() || code.length < length) {
      setErrors(`Please enter the ${length}-digit code sent to your email`)
      return
    }
    setErrors("")
    if (onSubmit) {
      onSubmit(e, code)
    }
  }
  
  return (
  <div className="otp-input-container">
    <form onSubmit={handleSubmit}>
      <div className="otp-inputs-wrapper" onPaste={handlePaste}>
        {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          type="text"
          inputMode="numeric"
          value={digit}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          maxLength="1"
          className={`otp-input ${digit ? 'otp-input-filled' : ''} ${errors ? 'otp-input-error' : ''}`}
          aria-label={`Digit ${index + 1}`}
        />
        ))}
      </div>
      {errors && <span className="otp-error">{errors}</span>}
      <SubmitButton text="Verify Code" />
    </form>
  </div>
  )
}
export default OtpInput