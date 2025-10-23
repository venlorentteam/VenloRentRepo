
import { Link } from 'react-router-dom'
import './EmailAuth.css'
import axios from 'axios'
import { PrelimFooter, PrelimHeader, OtpInput } from '../exports'

function EmailAuth(){

const handleSubmit = async (e, otp) => {
  e.preventDefault()
  try{
    const res = await axios.post("http://localhost:4000/api/email-auth", {otp})
    if(res.data.success){
      //validation successful,
    }
    console.log(res.data)
  }
  catch(err){
    console.log(err.response?.data?.message || "Error submitting request")
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
