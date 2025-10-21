import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Register.css'
import leftImg from '../assets/img/login-left1.png'
import axios from 'axios'
import { PrelimFooter, PrelimHeader, SubmitButton } from '../exports'
import { MdOutlineMailOutline, MdLockOutline } from 'react-icons/md'
import { RiAccountPinBoxLine } from 'react-icons/ri'
import { FaRegEyeSlash, FaRegEye} from 'react-icons/fa'
import { PiIdentificationBadge, PiIdentificationCard } from 'react-icons/pi'
function Register () {
  const [showPass, setShowPass] = useState(false)
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
  email: "",
  password: "",
  fullname: "",
  username: "",
})
const showPassword = () => {
  setShowPass(prev => !prev)
}
const handleChange = (e) => {
   const { name, value } = e.target;
  // Update form data
  setFormData({
    ...formData,
    [name]: value,
  });

  let formErrors
  // validate only the currently edited field
  switch (name) {
    case "email":
      if (!value.trim()) formErrors = "Email is required";
      else if (!/^\S+@\S+\.\S+$/.test(value)) formErrors = "Please enter a valid email address";
      break;
    case "password":
      if (!value.trim()) formErrors = "Password is required";
      else if (value.length < 6) formErrors = "Password should be at least 6 characters long";
      break;
    case "fullname":
      if (!value.trim()) formErrors = "Full Name is required";
      break;
    case "username":
      if (!value.trim()) formErrors = "Username is required";
      break;
    default:
      break;
  }

  // Update only that field's error
  setErrors((prev) => ({
    ...prev,
    [name]: formErrors
  }));
}

const handleSubmit = async (e) => {
    e.preventDefault()
    if(Object.keys(errors).length === 0){
        try{
            const res = await axios.post("http://localhost:4000/api/login", formData)
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
              <input type="checkbox" name="agree" />
              <p className="regular-texts">I have read and agreed to NewProduct's <Link to="/terms">User Agreement</Link> and <Link to="/privacy-policy">Privacy Policy</Link>.</p>
            </span>
            <SubmitButton text="Sign up" />
            <p className='regular-texts' style={{textAlign: 'center'}}>Have an account? <Link to="/login">Log in</Link></p>
          </form>
        </div>
    </div>
   <PrelimFooter />
    </>
  )
}

export default Register