import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './passwordRecovery.css'
import axios from 'axios'
import { PrelimFooter, PrelimHeader, SubmitButton } from '../exports'
import { MdOutlineMailOutline, MdOutlineMarkEmailRead } from 'react-icons/md'

function PasswordRecovery () {
    const [errors, setErrors] = useState({})
    const [submitted,  setSubmitted]  = useState(false)
    const [isLoading,  setIsLoading]  = useState(false)
    const [formData, setFormData] = useState({
        email: "",
    })

    const handleChange = (e) => {
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: "" })
        }
        setFormData({
            ...formData, [e.target.name]: e.target.value
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

        setErrors(formErrors)

        if (Object.keys(formErrors).length === 0) {
            setIsLoading(true)
            try {
                const res = await axios.post("https://newprojectbackend-5axx.onrender.com/auth/password-recovery", formData)
                if (res.data.success) {
                   setSubmitted(true)
                }
            } catch (err) {
                setErrors({ ...errors, submit: err.response?.data?.message || err.message || "Error submitting request"})
            }finally{
                setIsLoading(false)
            }
        }
    }
    if(submitted){
        return(
            <>
                <div className="login-cont">
                    <div className="login">
                        <div className="recovery-icon-cont">
                            <MdOutlineMarkEmailRead className="recovery-success-icon" />
                        </div>
                        <h2 className="recovery-success-title">
                            Email Sent
                        </h2>
                        <p className="recovery-success-sub">
                            If <strong>{formData.email}</strong> is registered with VenloRent, 
                            you'll receive a reset link shortly.
                        </p>
                        <p className="recovery-success-sub">
                            The link expires in 30 minutes. Check your spam folder if 
                            you don't see it.
                        </p>
                    </div>
                </div>
                <PrelimFooter />
            </>
        )
    }
    return (
        <>
            <div className="login-cont">
                <div className="login">
                    <PrelimHeader
                        pageTitle="Recover your password"
                        pageSubTitle="Enter the email associated with your account"
                    />
                    <form onSubmit={handleSubmit}>
                        <div className="input-wrapper">
                            <MdOutlineMailOutline class="input-icon-left" />
                            <input
                                className={`form-input ${errors.email ? 'input-error' : ''}`}
                                type="text"
                                name="email"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
                            />
                            
                        </div>
                        {errors.email && <span className='error-message'>{errors.email}</span>}
                        
                        {/* Submit Error */}
                        {errors.submit && (
                            <div className="submit-error">
                                {errors.submit}
                            </div>
                        )}
                        {/* Submit button */}
                        <SubmitButton 
                            text={isLoading ? "Checking email" : "Continue"} 
                            disabled={isLoading}
                        />
                    </form>
                    <Link to="/login" className="recovery-back-link">
                        Remembered it? <span>Back to login</span>
                    </Link>
                </div>
            </div>
            <PrelimFooter />
        </>
    )
}

export default PasswordRecovery