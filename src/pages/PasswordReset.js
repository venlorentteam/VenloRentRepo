import React, { useState } from 'react'
import './login.css'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { PrelimFooter, PrelimHeader, SubmitButton } from '../exports'
import { MdLockOutline } from 'react-icons/md'
import { FaRegEyeSlash, FaRegEye} from 'react-icons/fa'
function PasswordReset () {
    const [showPass1, setShowPass1] = useState(false)
    const [showPass2, setShowPass2] = useState(false)
    const [ isLoading, setIsLoading ] = useState(false)
    const [errors, setErrors] = useState({})
    const [success, setSuccess ] = useState("")
    const [formData, setFormData] = useState({
        pass1: "",
        pass2: "",
    })

const handleChange = (e) => {
  const {name, value} = e.target
    setFormData(prev => ({
        ...prev, [name] : value
    }))
}
const handleSubmit = async (e) => {
    e.preventDefault()
    const formErrors = {}
    if (!formData.pass1.trim()) formErrors.pass1 = "Enter your new password"
    if (!formData.pass2.trim()) formErrors.pass2 = "Enter new password confirmation"
    if (formData.pass1 !== formData.pass2) formErrors.pass = "Both passwords don't match, please check and try again"
    setErrors(formErrors)
    if(Object.keys(formErrors).length === 0){
        setIsLoading(true)
        try{
            const res = await axios.post("https://newprojectbackend-5axx.onrender.com/auth/password-reset", formData)
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