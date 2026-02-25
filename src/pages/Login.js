import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import leftImg from '../assets/img/Venlo-welcome.png'
import axios from 'axios'
import { PrelimFooter, PrelimHeader, SubmitButton } from '../exports'
import { MdOutlineMailOutline, MdLockOutline } from 'react-icons/md'
import { FaRegEyeSlash, FaRegEye } from 'react-icons/fa'
import './login.css'

function Login() {
    const [showPass, setShowPass] = useState(false)
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    const showPassword = () => {
        setShowPass(prev => !prev)
    }

    const handleChange = (e) => {
        // Clear error for this field when user starts typing
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: "" })
        }
        setFormData({
            ...formData, 
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formErrors = {}
        
        if (!formData.email.trim()) {
            formErrors.email = "Email is required"
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            formErrors.email = "Please enter a valid email address"
        }
        
        if (!formData.password.trim()) {
            formErrors.password = "Password is required"
        } else if (formData.password.length < 6) {
            formErrors.password = "Password must be at least 6 characters"
        }
        
        setErrors(formErrors)
        
        if (Object.keys(formErrors).length === 0) {
            setIsLoading(true)
            try {
                const res = await axios.post("http://localhost:4000/api/login", formData)
                if (res.data.success) {
                    // Generate token and navigate to dashboard
                    // localStorage.setItem('token', res.data.token)
                    // navigate('/dashboard')
                }
                console.log(res.data)
            } catch (err) {
                setErrors({ 
                    submit: err.response?.data?.message || "Error logging in. Please try again." 
                })
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }
    }

    return (
        <>
            <div className="login-page">
                <div className="login-container">
                    {/* Left Side - Hero Section */}
                    <div className="login-hero">
                        <div className="login-hero-content">
                            <img 
                                className="login-hero-image" 
                                src={leftImg} 
                                alt="Welcome to LeasePal" 
                            />
                            <div className="login-hero-text">
                                <h1 className="login-hero-title">
                                    Find it. Love it. Rent it.
                                </h1>
                                <p className="login-hero-subtitle">
                                    Skip the stress, find the best with Nigeria's most trusted property marketplace.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Login Form */}
                    <div className="login-form-section">
                        <div className="login-form-container">
                            <PrelimHeader pageTitle="Welcome back" />
                            
                            <form onSubmit={handleSubmit} className="login-form">
                                {/* Email Input */}
                                <div className="form-group">
                                    <label htmlFor="email" className="form-label">
                                        Email address
                                    </label>
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
                                    <label htmlFor="password" className="form-label">
                                        Password
                                    </label>
                                    <div className="input-wrapper">
                                        <MdLockOutline className="input-icon-left" />
                                        <input
                                            id="password"
                                            className={`form-input ${errors.password ? 'input-error' : ''}`}
                                            type={showPass ? "text" : "password"}
                                            name="password"
                                            placeholder="Enter your password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            autoComplete="current-password"
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

                                {/* Forgot Password Link */}
                                <div className="form-footer">
                                    <Link to="/password-recovery" className="forgot-password-link">
                                        Forgot Password?
                                    </Link>
                                </div>

                                {/* Submit Error */}
                                {errors.submit && (
                                    <div className="submit-error">
                                        {errors.submit}
                                    </div>
                                )}

                                {/* Submit Button */}
                                <SubmitButton 
                                    text={isLoading ? "Logging in..." : "Log In"} 
                                    disabled={isLoading}
                                />

                                {/* Sign Up Link */}
                                <p className="signup-prompt">
                                    Don't have an account?{' '}
                                    <Link to="/register" className="signup-link">
                                        Sign up
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

export default Login