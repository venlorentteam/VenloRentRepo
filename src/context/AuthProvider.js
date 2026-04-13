import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import defaultAvatar from "../assets/img/avatar.png"

// Avatar single helper — normalize once, use everywhere
const normalizeUser = (user) => ({
  ...user,
  avatar: user.avatar || defaultAvatar,
})

//Create Context Provider
const AuthContext = createContext()

//Define Context Coomponent
const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        //Check for token in localStorage
        const token = localStorage.getItem("token");

        if (!token) {
            setIsLoading(false)
            return
        }
        //Verify token and fetch user profile
        const verifyUser = async () => {
            try {
                const res = await axios.get("https://newprojectbackend-5axx.onrender.com/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setUser(normalizeUser(res.data.user))
            } catch(err){
                localStorage.removeItem("token")
                setUser(null)
            } finally {
                setIsLoading(false)
            }
        };
        verifyUser()
    }, [])

    //Login Function
    const login = async (email, password) => {
        const res = await axios.post("https://newprojectbackend-5axx.onrender.com/auth/login", {email, password})
        if (!res.data?.token || !res.data?.user) {
            throw new Error(res.data?.message || "Login failed")
        }
        localStorage.setItem("token", res.data.token)
        const normalized = normalizeUser(res.data.user)
        setUser(normalized)  // normalize on login
        return normalized
    }

    //Logout Function
    const logout = () => {
        localStorage.removeItem("token")
        setUser(null)
    }

    //Update User Function
    const updateUser = (updatedData) => {
        setUser(prev => normalizeUser({ ...prev, ...updatedData }))  // normalize on update
    }
    //Return Context Provider with user and auth functions
    return (
        <AuthContext.Provider value={{ user, isLoading, login, updateUser, logout}}>
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;
