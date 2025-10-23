import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Register.css'
import axios from 'axios'
import { FaRegEyeSlash, FaRegEye} from 'react-icons/fa'
import { PrelimFooter, PrelimHeader, SubmitButton } from '../exports'
import { MdOutlineMailOutline, MdLockOutline } from 'react-icons/md'
import { RiAccountPinBoxLine } from 'react-icons/ri'
import { PiIdentificationBadge } from 'react-icons/pi'

function Register() {
  const [showPass, setShowPass] = useState(false)
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullname: "",
    username: "",
  })
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
     // validate the changed field
    let error = ""
    switch (name) {
      case "email":
        if (!value.trim()) error = "Email is required"
        else if (!/^\S+@\S+\.\S+$/.test(value)) error = "Invalid email address"
        break
      case "password":
        if (!value.trim()) error = "Password is required"
        else if (value.length < 6) error = "Password must be at least 6 characters"
        break
      case "fullname":
        if (!value.trim()) error = "Full name is required"
        break
      case "username":
        if (!value.trim()) error = "Username is required"
        break
      default:
        break
    }

    // update errors state for that field
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }))

  }
  //Password visibility toggle
  const showPassword = () => {
    setShowPass(prev => !prev)
  }

   //check if form has  any or empty required field
  const hasErrors =
    Object.values(errors).some((err) => err) ||
    Object.values(formData).some((val) => val === "" || val === false)

  //Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (Object.keys(errors).length === 0) {
      try {
        const res = await axios.post("http://localhost:4000/api/login", formData)
        if (res.data.success) {
          // generate token and navigate() to dashboard
        }
        console.log(res.data)
      } catch (err) {
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
  /** Right positioned descriptive icon for the input **/
  fontSize: "var(--font-size-medium)",
  position: "absolute",
  top: "2.5px",
  right: "8px",
  color: "var(--primary-color)",
  cursor: "pointer"
}
  return (
    <>
    <div className="register-cont">
        {/* 
          <div className="left-side">
            <img className="left-img" src={leftImg} alt="Welcome" />
            <h2>Find it. Love it. Rent it.</h2>
            <p>Skip the stress, find the best...</p>
          </div> 
        */}
        <div className="register">
          <PrelimHeader pageTitle="Create an account" />
          <form onSubmit={handleSubmit}>
            <span className="input-cont"><input type="text" name="email" placeholder="Email" value={formData.email} onChange={handleChange} /><MdOutlineMailOutline style={iconLeft} /></span>
            {errors.email && <span className='error'>{errors.email}</span>}
            <span className="input-cont"><input type={showPass ? "text" : "password"} name="password" placeholder="Password" value={formData.password} onChange={handleChange} /><MdLockOutline style={iconLeft} /><span style={iconRight} onClick={showPassword}>{showPass ? <FaRegEye /> : <FaRegEyeSlash />}</span></span>
            {errors.password && <span className='error'>{errors.password}</span>}
            <span className="input-cont"><input type="text" name="fullname" placeholder="Full Name" value={formData.fullname} onChange={handleChange} /><RiAccountPinBoxLine style={iconLeft} /></span>
            {errors.fullname && <span className='error'>{errors.fullname}</span>}
            <span className="input-cont"><input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} /><PiIdentificationBadge style={iconLeft} /></span>
            {errors.username && <span className='error'>{errors.username}</span>}
            <span className="check-cont">
              {/* <input type="checkbox" name="agree" /> */}
              <p className="regular-texts">By signing up, you agree to NewProduct's <Link to="/terms">User Agreement</Link> and <Link to="/privacy-policy">Privacy Policy</Link>.</p>
            </span>
            <SubmitButton text="Sign up" disabled={hasErrors} />
            <p className='regular-texts' style={{textAlign: 'center'}}>Have an account? <Link to="/login">Log in</Link></p>
          </form>
        </div>
    </div>
   <PrelimFooter />
    </>
  )
}

export default Register