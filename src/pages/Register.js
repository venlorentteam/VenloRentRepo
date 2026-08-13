import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Register.css'
import axios from 'axios'
import leftImg from '../assets/img/Venlo-welcome.png'
import { FaRegEyeSlash, FaRegEye } from 'react-icons/fa'
import { PrelimFooter, PrelimHeader, SubmitButton } from '../exports'
import { MdOutlineMailOutline, MdLockOutline, MdOutlineBusinessCenter } from 'react-icons/md'
import { RiAccountPinBoxLine } from 'react-icons/ri'
import { PiIdentificationBadge } from 'react-icons/pi'
import { API_BASE } from '../config/api'

function Register() {
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullname: "",
    username: "",
    agent: false,
  })
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    // Handle checkbox differently
    if (type === "checkbox") {
      setFormData(prev => ({ ...prev, [name]: checked }))
      return
    }
    // Update form data
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Validate the changed field
    let error = ""
    let confirmPasswordError = errors.confirmPassword || ""
    switch (name) {
      case "email":
        if (!value.trim()) {
          error = "Email is required"
        } else if (!/^\S+@\S+\.\S+$/.test(value)) {
          error = "Invalid email address"
        }
        break
      case "password":
        if (!value.trim()) {
          error = "Password is required"
        } else if (value.length < 6) {
          error = "Password must be at least 6 characters"
        }else if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/.test(value)){
          error = "Password must contain letters, numbers and special character"
        }
        if (formData.confirmPassword.trim()) {
          confirmPasswordError =
            value === formData.confirmPassword ? "" : "Passwords do not match"
        }
        break
      case "confirmPassword":
        if (!value.trim()) {
          error = "Please confirm your password"
        } else if (value !== formData.password) {
          error = "Passwords do not match"
        }
        break
      case "fullname":
        if (!value.trim()) {
          error = "Full name is required"
        }
        break
      case "username":
        if (!value.trim()) {
          error = "Username is required"
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          error = "Username can only contain letters, numbers, and underscores"
        } else if (value.length < 3) {
          error = "Username must be at least 3 characters"
        }
        break
      default:
        break
    }

    setErrors((prev) => {
      const nextErrors = { ...prev, [name]: error }
      if (name === "password") {
        nextErrors.confirmPassword = confirmPasswordError
      }
      return nextErrors
    })
  }

  // Check if user exists on blur of email and username fields
  const checkUserAvailability = async () => {
    const email = formData.email.trim()
    const username = formData.username.trim()
   
    // Only check email availability if it's a valid format
    const emailValid = email && /^\S+@\S+\.\S+$/.test(email)
    // Only check username availability if it's a valid format  
    const usernameValid = username && /^[a-zA-Z0-9_]+$/.test(username) && username.length >= 3

    // Nothing valid to check, cancel
    if (!emailValid && !usernameValid) return

    try {
      const payload = {}
      if (emailValid) payload.email = email
      if (usernameValid) payload.username = username

      const res = await axios.post(`${API_BASE}/auth/check-user`, payload)
      setErrors((prev) => ({
        ...prev,
        email: res.data.emailExists ? "Email already in use" : "",
        username: res.data.usernameExists ? "Username already in use" : "",
      }))
    } catch {
      setErrors((prev) => ({
        ...prev,
        email: "Error checking Email availability",
        username: "Error checking Username availability",
      }))
    }
  }

  // Password visibility toggle
  const showPassword = () => setShowPass(prev => !prev)

  // Toggle agent card
  const toggleAgent = () => {
    if (!isLoading) setFormData(prev => ({ ...prev, agent: !prev.agent }))
  }

  // Check if form has any errors or empty required fields
  const hasErrors =
    Object.values(errors).some((err) => err) ||
    ["email", "password", "confirmPassword", "fullname", "username"].some(
      (key) => !formData[key].trim()
    )

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!hasErrors) {
      setIsLoading(true)
      try {
        const payload = {
          email: formData.email,
          username: formData.username,
          password: formData.password,
          fullName: formData.fullname,
          role: formData.agent ? "agent" : "regular",
        }

        const res = await axios.post(`${API_BASE}/auth/register`, payload)
        if (res.data.success) {
          // Always go to email-auth first for OTP verification.
          // Pass role in state so email-auth can redirect correctly after verification:
          //   role === "agent"   => navigate('/kyc')
          //   role === "regular" => navigate('/dashboard')
          navigate('/email-auth', {
            state: { 
              email: res.data.user.email,
              role: res.data.user.role,
            }
          })
        }
      } catch (err) {
        setErrors({
          submit: err.response?.data?.message || "Error creating account. Please try again."
        })
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <>
      <div className="register-page">
        <div className="register-container">
          {/* Left Side - Hero Section */}
          <div className="register-hero">
            <div className="register-hero-content">
              <img 
                className="register-hero-image" 
                src={leftImg} 
                alt="Welcome to VenloRent" 
              />
              <div className="register-hero-text">
                <h1 className="register-hero-title">
                  Join VenloRent Today
                </h1>
                <p className="register-hero-subtitle">
                  Connect with trusted agents and find your perfect home in minutes.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="register-form-section">
            <div className="register-form-container">
              <PrelimHeader pageTitle="Create an account" />
              
              <form onSubmit={handleSubmit} className="register-form">

                {/* Email Input */}
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email address</label>
                  <div className="input-wrapper">
                    <MdOutlineMailOutline className="input-icon-left" />
                    <input
                      id="email"
                      className={`form-input ${errors.email ? 'input-error' : ''}`}
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={checkUserAvailability}
                      autoComplete="email"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.email && (
                    <span className="error-message">{errors.email}</span>
                  )}
                </div>

                {/* Password Input */}
                <div className="form-group">
                  <label htmlFor="password" className="form-label">Password</label>
                  <div className="input-wrapper">
                    <MdLockOutline className="input-icon-left" />
                    <input
                      id="password"
                      className={`form-input ${errors.password ? 'input-error' : ''}`}
                      type={showPass ? "text" : "password"}
                      name="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="input-icon-right"
                      onClick={showPassword}
                      aria-label={showPass ? "Hide password" : "Show password"}
                    >
                      {showPass ? <FaRegEye /> : <FaRegEyeSlash />}
                    </button>
                  </div>
                  {errors.password && (
                    <span className="error-message">{errors.password}</span>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <div className="input-wrapper">
                    <MdLockOutline className="input-icon-left" />
                    <input
                      id="confirmPassword"
                      className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                      type={showPass ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      autoComplete="new-password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="input-icon-right"
                      onClick={showPassword}
                      aria-label={showPass ? "Hide password" : "Show password"}
                    >
                      {showPass ? <FaRegEye /> : <FaRegEyeSlash />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <span className="error-message">{errors.confirmPassword}</span>
                  )}
                </div>

                {/* Full Name Input */}
                <div className="form-group">
                  <label htmlFor="fullname" className="form-label">Full Name</label>
                  <div className="input-wrapper">
                    <RiAccountPinBoxLine className="input-icon-left" />
                    <input
                      id="fullname"
                      className={`form-input ${errors.fullname ? 'input-error' : ''}`}
                      type="text"
                      name="fullname"
                      placeholder="Enter your full name"
                      value={formData.fullname}
                      onChange={handleChange}
                      autoComplete="name"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.fullname && (
                    <span className="error-message">{errors.fullname}</span>
                  )}
                </div>

                {/* Username Input */}
                <div className="form-group">
                  <label htmlFor="username" className="form-label">Username</label>
                  <div className="input-wrapper">
                    <PiIdentificationBadge className="input-icon-left" />
                    <input
                      id="username"
                      className={`form-input ${errors.username ? 'input-error' : ''}`}
                      type="text"
                      name="username"
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={handleChange}
                      onBlur={checkUserAvailability}
                      autoComplete="username"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.username && (
                    <span className="error-message">{errors.username}</span>
                  )}
                </div>

                {/* == Agent Selection Card ===================================
                  Hidden checkbox keeps formData.agent in sync for the payload.
                  The visible card below drives the toggle interaction.
                ===============================================================*/}
                <input
                  type="checkbox"
                  id="agent"
                  name="agent"
                  checked={formData.agent}
                  onChange={handleChange}
                  disabled={isLoading}
                  style={{ display: 'none' }}
                />
                <div
                  className={`agent-card ${formData.agent ? 'agent-card--active' : ''}`}
                  onClick={toggleAgent}
                  role="checkbox"
                  aria-checked={formData.agent}
                  aria-label="Register as an agent"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === ' ' && toggleAgent()}
                >
                  <div className={`agent-card-icon ${formData.agent ? 'agent-card-icon--active' : ''}`}>
                    <MdOutlineBusinessCenter />
                  </div>
                  <div className="agent-card-text">
                    <span className="agent-card-title">I'm a property agent</span>
                    <span className="agent-card-subtitle">
                      You'll complete a quick KYC verification after signing up
                    </span>
                  </div>
                  <div className={`agent-card-check ${formData.agent ? 'agent-card-check--active' : ''}`}>
                    {formData.agent && (
                      <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                        <path d="M1 4L4 7.5L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="terms-agreement">
                  <p className="terms-text">
                    By signing up, you agree to VenloRent's{' '}
                    <Link to="/terms" className="terms-link">User Agreement</Link>
                    {' '}and{' '}
                    <Link to="/privacy-policy" className="terms-link">Privacy Policy</Link>.
                  </p>
                </div>

                {/* Submit Error */}
                {errors.submit && (
                  <div className="submit-error">
                    {errors.submit}
                  </div>
                )}

                {/* Submit Button — label reacts to agent intent */}
                <SubmitButton 
                  text={isLoading 
                    ? "Creating account..." 
                    : formData.agent 
                      ? "Sign up & Get Verified" 
                      : "Sign up"
                  } 
                  disabled={hasErrors || isLoading}
                  isLoading={isLoading}
                />

                {/* Login Link */}
                <p className="login-prompt">
                  Already have an account?{' '}
                  <Link to="/login" className="login-link">
                    Log in
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
      <PrelimFooter />
    </>
  )
}

export default Register