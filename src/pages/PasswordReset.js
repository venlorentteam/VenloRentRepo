import React, { useEffect, useState } from 'react'
import './login.css'
import { Link, useSearchParams, useParams } from 'react-router-dom'
import axios from 'axios'
import { PrelimFooter, PrelimHeader, SubmitButton, Loader } from '../exports'
import { MdLockOutline } from 'react-icons/md'
import { FaRegEyeSlash, FaRegEye} from 'react-icons/fa'
import { API_BASE } from '../config/api'

function PasswordReset () {
    const [showPass1, setShowPass1] = useState(false)
    const [showPass2, setShowPass2] = useState(false)
    const [ isLoading, setIsLoading ] = useState(false)
    const [isCheckingToken, setIsCheckingToken] = useState(true)
    const [isTokenValid, setIsTokenValid] = useState(false)
    const [errors, setErrors] = useState({})
    const [success, setSuccess ] = useState("")
    const [searchParams] = useSearchParams()
    const params = useParams()
    const token = searchParams.get("token") || params.token || ""
    const [formData, setFormData] = useState({
        pass1: "",
        pass2: "",
    })

useEffect(() => {
    const validateToken = async () => {
        if (!token) {
            setErrors({ submit: "Reset link is missing a token. Please request a new password reset email." })
            setIsCheckingToken(false)
            setIsTokenValid(false)
            return
        }

        try {
            setIsCheckingToken(true)
            const res = await axios.get(`${API_BASE}/auth/reset-password/${token}`)
            if (res.data?.valid) {
                setIsTokenValid(true)
                setErrors({})
            } else {
                setIsTokenValid(false)
                setErrors({ submit: res.data?.message || "This reset link is invalid or has expired." })
            }
        } catch (err) {
            setIsTokenValid(false)
            setErrors({
                submit: err.response?.data?.message || "This reset link is invalid or has expired.",
            })
        } finally {
            setIsCheckingToken(false)
        }
    }

    validateToken()
}, [token])

const handleChange = (e) => {
  const {name, value} = e.target
    setFormData(prev => ({
        ...prev, [name] : value
    }))
}
const handleSubmit = async (e) => {
    e.preventDefault()
    const formErrors = {}
    if (!token || !isTokenValid) formErrors.submit = "Reset token is missing or invalid. Please use the link from your email."
    if (!formData.pass1.trim()) formErrors.pass1 = "Enter your new password"
    if (!formData.pass2.trim()) formErrors.pass2 = "Enter new password confirmation"
    if (formData.pass1 !== formData.pass2) formErrors.pass = "Both passwords don't match, please check and try again"
    setErrors(formErrors)
    if(Object.keys(formErrors).length === 0){
        setIsLoading(true)
        try{
            const res = await axios.post(`${API_BASE}/auth/password-reset`, {
                token,
                password: formData.pass1,
                confirmPassword: formData.pass2,
            })
            if(res.data.success){
                setSuccess("Your password has been successfully reset... proceed to login")
            }
        }
        catch(err){
            setErrors(prev => ({...prev, submit: err.response?.data?.message || "Error submitting request"}))
        }finally{
            setIsLoading(false)
        }
    }
}

  return (
    <>
    <div className="login-cont">
        {/* <div className="left-side">
            <img className="left-img" src={leftImg} alt="Welcome" />
            <h2>Find it. Love it. Rent it.</h2>
            <p>Skip the stress, find the best...</p>
        </div> */}
        <div className="login">
           <PrelimHeader pageTitle="Reset Password"/>
            {isCheckingToken ? (
                <Loader />
            ) : !isTokenValid ? (
                <>
                    {errors.submit && (
                        <div className="submit-error">
                            {errors.submit}
                        </div>
                    )}
                    <Link to="/password-recovery" className="recovery-back-link">
                        Need a new link? <span>Request password reset</span>
                    </Link>
                </>
            ) : (
                <form onSubmit={handleSubmit}>
                    <span className="input-cont">
                        <input className="login-input" 
                            type={showPass1 ? "text" : "password"} 
                            name="pass1" placeholder="New password" 
                            value={formData.pass1} 
                            onChange={handleChange} 
                        />
                        <MdLockOutline />
                        <span className="input-icon-right" onClick={() => setShowPass1(prev => !prev)}>{showPass1 ? <FaRegEye /> : <FaRegEyeSlash />}</span>
                    </span>
                    {errors.pass1 && <span className='error-message'>{errors.pass1}</span>}

                    <span className="input-cont">
                        <input className="login-input" 
                            type={showPass2 ? "text" : "password"} 
                            name="pass2" placeholder="Confirm new password" 
                            value={formData.pass2} 
                            onChange={handleChange} 
                        />
                        <MdLockOutline />
                        <span className="input-icon-right" onClick={() => setShowPass2(prev => !prev)}>{showPass2 ? <FaRegEye /> : <FaRegEyeSlash />}</span>
                    </span>
                    {errors.pass2 && <span className='error-message'>{errors.pass2}</span>}
                    {errors.pass && <span className='error-message'>{errors.pass}</span>}
                    {/* Submit Error */}
                    {errors.submit && (
                        <div className="submit-error">
                            {errors.submit}
                        </div>
                    )}
                    {/* Success Message */}
                    {success && (
                        <div className="submit-success">
                            {success}
                        </div>
                    )}
                    <SubmitButton 
                        text={isLoading ? "Resetting Password" : "Reset Password"}
                        disabled={isLoading}
                    />
                </form>
            )}
            <Link to="/login" className="recovery-back-link">
                Done here? <span>Back to login</span>
            </Link>
        </div>
    </div>
   <PrelimFooter />
    </>
  )
}

export default PasswordReset
