import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './passwordRecovery.css'
import axios from 'axios'
import { PrelimFooter, PrelimHeader, SubmitButton } from '../exports'
import { MdOutlineMailOutline } from 'react-icons/md'

function PasswordRecovery () {
    const [errors, setErrors] = useState({})
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
            try {
                const res = await axios.post("http://localhost:4000/api/password-recovery", formData)
                if (res.data.success) {
                    //generate token and navigate() to dashboard
                }
                console.log(res.data)
            } catch (err) {
                console.log(err.response?.data?.message || "Error submitting request")
            }
        }
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
                        <span className="input-cont">
                            <input
                                className="login-input"
                                type="text"
                                name="email"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
                            />
                            <MdOutlineMailOutline />
                        </span>
                        {errors.email && <span className='error'>{errors.email}</span>}
                        <SubmitButton text="Continue" />
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