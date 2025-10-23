import React, { useState, useRef } from 'react'
import { SubmitButton } from '../exports';
import './OtpInput.css'

function OtpInput({length = 6, onSubmit}) {
    const [otp, setOtp] = useState(Array(length).fill(""));
    const [errors , setErrors] = useState("");
    const inputsRef = useRef([]);

    const handleChange = (value, index) => {
        if(!/^[0-9]?$/.test(value)) return; //only digits allowed

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // move to next input automatically
        if(value && index < length - 1){
            inputsRef.current[index + 1].focus();
        }
    }

    //in the event of backspace
    const handleKeyDown = (e, index) => {
        if(e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1].focus()
        }
    }

    //incase otp is pasted
    const handlePaste = (e) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData("Text").slice(0, length).split("")
        setOtp((prev) => {
            const newOtp = [...prev]
            pastedData.forEach((char, i) => (newOtp[i] = char))
            return newOtp
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const code = otp.join("")
        const checkErrors = {}
        if(!code.trim())checkErrors.otp = "Please enter the OTP sent to your email"
        
        setErrors(checkErrors)//set errors state
        
        if(Object.keys(checkErrors).length === 0){
            onSubmit(e, code)
        }
    };

    return (
    <div>
        <form onSubmit={handleSubmit}>
            <div onPaste={handlePaste} className='input-container'>
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => (inputsRef.current[index] = el)}
                        value={digit}
                        onChange={(e) => handleChange(e.target.value, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        maxLength="1"
                    />
                    
                ))}
            </div>
            {errors.otp && <span className='error'>{errors.otp}</span>}
            <SubmitButton text="Verify" />
        </form>
    </div>
  )
}

export default OtpInput