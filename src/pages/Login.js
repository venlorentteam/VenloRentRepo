import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../assets/css/login.css'
import leftImg from '../assets/img/login-left1.png'
import axios from 'axios'
import { SubmitButton } from '../exports'
import { MdOutlineMailOutline, MdLockOutline } from 'react-icons/md'
function Login () {
    const [errors, setErrors] = useState({})
    const [formData, setFormData] = useState({
    email: "",
    password: "",
})
const handleChange = (e) => {
    setFormData({
        ...formData, [e.target.name] : e.target.value
    })
}
const handleSubmit = async (e) => {
    e.preventDefault()
    const formErrors = {}
    if (!formData.email.trim()){
         formErrors.email = "Email is required"
    }else if(!/^\S+@\S+\.\S+$/.test(formData.email)){
        formErrors.email = "Please enter a valid email address"
    }
    if (!formData.password.trim()) formErrors.password = "Password is required"
    setErrors(formErrors)
    if(Object.keys(formErrors).length === 0){
        try{
            const res = await axios.post("http://localhost:4000/api/login", formData)
            //if(res.data.success){
                //generate token and navgate() to dashboard
            //}
            //console.log(res.data)
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
    top: "4px",
    left: "8px",
    color: "var(--primary-color)"
}
  return (
    <>
    <div className="login-cont">
        <div className="left-side">
            <img className="left-img" src={leftImg} />
            <h2>Find it. Love it. Rent it.</h2>
            <p>Skip the stress, find the best...</p>
        </div>
        <div className="login">
            <img className="login-logo-img" src="https://i.pravatar.cc/100" />
            <h2 className="page-title">Welcome Back </h2>
            <form onSubmit={handleSubmit}>
                <span className="input-cont"><input type="text" name="email" placeholder="Email" value={formData.email} onChange={handleChange} /><MdOutlineMailOutline style={iconLeft} /></span>
                {errors.email && <span className='error'>{errors.email}</span>}
                <span className="input-cont"><input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} /><MdLockOutline style={iconLeft} /></span>
                {errors.password && <span className='error'>{errors.password}</span>}
                <p className='regular-texts' style={{textAlign: 'right'}}><Link to="/recover-password">Forgot Password?</Link></p>
                <SubmitButton text="Log In" />
                <p className='regular-texts' style={{textAlign: 'center'}}>Don't have an account? <Link to="/register">Sign up</Link></p>
            </form>
        </div>
    </div>
    <div className="footer-links">
        <Link to="/about">About</Link>
        <Link to="/help">Help Center</Link>
        <Link to="/terms">Terms of Service</Link>
    </div>
    </>
  )
}

export default Login