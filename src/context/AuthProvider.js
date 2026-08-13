import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import defaultAvatar from "../assets/img/avatar.png"
import { API_BASE } from '../config/api'

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
                const res = await axios.get(`${API_BASE}/profile`, {
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

    const refetchUser = useCallback( async () => {
        const token = localStorage.getItem("token")
        if (!token) return null

        try {
            const res = await axios.get(`${API_BASE}/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            const normalized = normalizeUser(res.data.user)
            setUser(normalized)
            return normalized.plan
        } catch (err) {
            return null
        }
    }, [])

    //Login Function
    const login = async (email, password) => {
        const res = await axios.post(`${API_BASE}/auth/login`, {email, password})
        if (!res.data?.token || !res.data?.user) {
            throw new Error(res.data?.message || "Login failed")
        }
        localStorage.setItem("token", res.data.token)
        const normalized = normalizeUser(res.data.user)
        setUser(normalized)  // normalize on login
        return normalized
    }

    // User state updater func
    const setAuthFromToken = (token, userData) => {
        localStorage.setItem("token", token)
        setUser(normalizeUser(userData))
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
        <AuthContext.Provider value={{ user, isLoading, login, updateUser, logout, refetchUser, setAuthFromToken }}>
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;
