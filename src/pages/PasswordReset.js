import React, { useState } from 'react'
import './login.css'
import leftImg from '../assets/img/login-left1.png'
import axios from 'axios'
import { PrelimFooter, PrelimHeader, SubmitButton } from '../exports'
import { MdLockOutline } from 'react-icons/md'
import { FaRegEyeSlash, FaRegEye} from 'react-icons/fa'
function PasswordReset () {
    const [showPass1, setShowPass1] = useState(false)
    const [showPass2, setShowPass2] = useState(false)
    const [errors, setErrors] = useState({})
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
        try{
            const res = await axios.post("http://localhost:4000/api/password-reset", formData)
            if(res.data.success){
                //generate token and navgate() to dashboard
            }
            console.log(res.data)
        }
        catch(err){
            console.log(err.response?.data?.message || "Error submitting request")
        }
    }
}
const iconLeft = {
    /** Left positioned descriptive icon for the input **/
    fontSize: "var(--font-size-medium)",
    position: "absolute",
    top: "2.5px",
    left: "8px",
    color: "var(--primary-color)"
}
const iconRight = {
    /** Left positioned descriptive icon for the input **/
    fontSize: "var(--font-size-medium)",
    position: "absolute",
    top: "2.5px",
    right: "8px",
    color: "var(--primary-color)",
    cursor: "pointer"
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
                <span className="input-cont"><input className="login-input" type={showPass1 ? "text" : "password"} name="pass1" placeholder="New password" value={formData.pass1} onChange={handleChange} /><MdLockOutline style={iconLeft} /><span style={iconRight} onClick={() => setShowPass1(prev => !prev)}>{showPass1 ? <FaRegEye /> : <FaRegEyeSlash />}</span></span>
                {errors.pass1 && <span className='error'>{errors.pass1}</span>}

                <span className="input-cont"><input className="login-input" type={showPass2 ? "text" : "password"} name="pass2" placeholder="Confirm new password" value={formData.pass2} onChange={handleChange} /><MdLockOutline style={iconLeft} /><span style={iconRight} onClick={() => setShowPass2(prev => !prev)}>{showPass2 ? <FaRegEye /> : <FaRegEyeSlash />}</span></span>
                {errors.pass2 && <span className='error'>{errors.pass2}</span>}
                {errors.pass && <p className='error'>{errors.pass}</p>}
                <SubmitButton text="Reset Password" />
            </form>
        </div>
    </div>
   <PrelimFooter />
    </>
  )
}

export default PasswordReset