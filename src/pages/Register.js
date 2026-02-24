import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Register.css'
import axios from 'axios'
import leftImg from '../assets/img/Venlo-welcome.png'
import { FaRegEyeSlash, FaRegEye } from 'react-icons/fa'
import { PrelimFooter, PrelimHeader, SubmitButton } from '../exports'
import { MdOutlineMailOutline, MdLockOutline } from 'react-icons/md'
import { RiAccountPinBoxLine } from 'react-icons/ri'
import { PiIdentificationBadge } from 'react-icons/pi'

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

    // Update errors state for that field
    setErrors((prev) => {
      const nextErrors = {
        ...prev,
        [name]: error,
      }

      if (name === "password") {
        nextErrors.confirmPassword = confirmPasswordError
      }

      return nextErrors
    })
  }
  //Check if user exists on blur of email and username fields
  const checkUserAvailability = async () => {
    const email = formData.email.trim()
    const username = formData.username.trim()

    if (!email && !username) return

    try {
      const res = await axios.post("http://localhost:4000/auth/check-user", { email, username })
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
  const showPassword = () => {
    setShowPass(prev => !prev)
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

        const res = await axios.post("http://localhost:4000/auth/register", payload)
        if (res.data.success) {
          // Store token and navigate to dashboard
          localStorage.setItem('token', res.data.token)
          if (payload.role === "agent") navigate('/kyc')
          navigate('/dashboard')
        }
        console.log(res.data)
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
                alt="Welcome to Venlorent" 
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
                {/* Confirm password Input */}
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

                {/* Agent selection option */}
                <div className="form-group">
                  <label htmlFor="Agent" className="form-label"> Register as an Agent</label>
                  <div className="check-wrapper">
                    <input
                      type="checkbox"
                      id="Agent"
                      name="agent"
                      checked={formData.agent}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                    <p>Check this box to register as an agent</p>
                  </div>
                </div>
                {/* Terms Agreement */}
                <div className="terms-agreement">
                  <p className="terms-text">
                    By signing up, you agree to Venlorent's{' '}
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

                {/* Submit Button */}
                <SubmitButton 
                  text={isLoading ? "Creating account..." : "Sign up"} 
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
