import React from 'react'
import '../assets/css/login.css'
import leftImg from '../assets/img/login-left1.png'
import axios from 'axios'

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
    try{
        const res = await axios.post("http://localhost:4000/api/login", formdata)
    }
    catch(err){
        err.response?.data?.message
    }
}
export const Login = () => {
  return (
    <div classsName="login-cont">
        <div className="left-side">
            <img className="left-img" src="" />
        </div>
        <div className="login">
            <form onSubmit={handleSubmit}>
                <input name="email" value={formData.email} onChange={handleChange} />
                <input name="password" value={formData.password} onChange={handleChange} />
                
            </form>
        </div>
    </div>
  )
}
