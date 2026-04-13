
import { useState, useEffect } from 'react'
import './EmailAuth.css'
import axios from 'axios'
import { PrelimFooter, PrelimHeader, OtpInput } from '../exports'
import { useLocation, useNavigate, Navigate } from 'react-router-dom'

// Cooldown duration in seconds — matches your OTP expiry window
const resendCoolDown = 60

function EmailAuth(){
  const [errors, setErrors] = useState()
  const [resendMsg,  setResendMsg]  = useState('')
  const [isResending, setIsResending] = useState(false)
  const [countdown, setCountdown] = useState(resendCoolDown)
  
  //Get state from useLocation to extract state object
  const { state } = useLocation()
  const navigate = useNavigate()
  
  useEffect(() => {
    if (countdown <= 0) return

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)   // cleanup on unmount
  }, [])

  if (!state?.email) return <Navigate to="/login" replace/>
  
  const handleSubmit = async (e, otp) => {
    e.preventDefault()
    
    try{
      const res = await axios.post("https://newprojectbackend-5axx.onrender.com/auth/email-verify", {email: state?.email, otp})
      if(res.data.success){//validation successful
        localStorage.setItem("token", res.data.token);
        const nextPath = state?.role === "agent" ? "/kyc" : "/dashboard"
        navigate(nextPath, {replace: true})
      }
    }
    catch(err){
      setErrors(err.response?.data?.message || "Error proccessing OTP")
    }
  }

  // Handle Resend if called
  const handleResend = async () => {
    if (countdown > 0 || isResending) return  // double guard

    setIsResending(true)
    setResendMsg('')
    setErrors('')

    try {
      await axios.post('https://newprojectbackend-5axx.onrender.com/auth/resend-otp', {
        email: state.email,
      })

      // Reset cooldown — user has to wait again before next resend
      setCountdown(resendCoolDown)
      setResendMsg('A new code has been sent to your email.')

      // Clear the success message after a few seconds
      setTimeout(() => setResendMsg(''), 5000)

    } catch (err) {
      setErrors(err.response?.data?.message || 'Failed to resend code. Try again.')
    } finally {
      setIsResending(false)
    }
  }

  // == Countdown display helper =========================================
  const formatCountdown = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <>
    <div className="email-cont">
      <div className="login">
        <PrelimHeader pageTitle="Almost There!" pageSubTitle="Check your inbox"/>
        <div className="email-is-sent">
          <p className="email-is-sent-text">
            A verification has been sent to <strong>{state?.email}.</strong> Please enter it below to complete your setup.
          </p>
        </div>
        <OtpInput onSubmit={handleSubmit} serverError={errors} onClearError={() => setErrors("")} />
        {/* 
          Three states:
          1. Counting down  → shows timer, button disabled
          2. Ready to resend → shows active button
          3. Resending      → shows loading state
        */}
        <div className="resend-section">
            {resendMsg && (
              <p className="resend-success">{resendMsg}</p>
            )}

            <p className="resend-prompt">
              Didn't receive a code?{' '}

              {countdown > 0 ? (
                // State 1 — still cooling down
                <span className="resend-countdown">
                  Resend in {formatCountdown(countdown)}
                </span>
              ) : (
                // State 2 & 3 — ready or loading
                <button
                  type="button"
                  className="resend-btn"
                  onClick={handleResend}
                  disabled={isResending}
                >
                  {isResending ? 'Sending...' : 'Resend code'}
                </button>
              )}
            </p>
          </div>
      </div>
    </div>
    <PrelimFooter />
    </>
  )
}

export default EmailAuth
