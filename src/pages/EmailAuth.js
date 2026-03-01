
import { useState } from 'react'
import './EmailAuth.css'
import axios from 'axios'
import { PrelimFooter, PrelimHeader, OtpInput } from '../exports'
import { useLocation, useNavigate } from 'react-router-dom'

function EmailAuth(){
  const [errors, setErrors] = useState()
  const { state } = useLocation()
  const navigate = useNavigate()
  const handleSubmit = async (e, otp) => {
    e.preventDefault()
    try{
      const res = await axios.post("http://localhost:4000/auth/email-verify", {email: state?.email, otp})
      if(res.data.success){//validation successful
        localStorage.setItem("token", res.data.token);
        const nextPath = state?.role === "agent" ? "/kyc" : "/dashboard"
        navigate(nextPath)
      }
      console.log(res.data)
    }
    catch(err){
      setErrors(err.response?.data?.message || "Error proccessing OTP")
    }
  }

  return (
    <>
    <div className="email-cont">
      {/* <div className="left-side">
        <img className="left-img" src={leftImg} alt="Welcome" />
        <h2>Find it. Love it. Rent it.</h2>
        <p>Skip the stress, find the best...</p>
      </div> */}
      <div className="login">
        <PrelimHeader pageSubTitle="Enter the code sent to your email"/>
        <OtpInput onSubmit={handleSubmit} />
      </div>
    </div>
    <PrelimFooter />
    </>
  )
}

export default EmailAuth
