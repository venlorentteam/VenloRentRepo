import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
const AuthContext = createContext()

//Define Context Coomponent
const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        //Check for token in localStorage
        const token = localStorage.getItem("token");

        if (!token) {
            setIsLoading(false);
            return
        }
        //Verify token and fetch user profile
        const verifyUser = async () => {
            try {
                const res = await axios.get("http://localhost:4000/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(res.data.user);
            } catch(err){
                localStorage.removeItem("token");
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        verifyUser();
    }, [])

    //Login Function
    const login = async (email, password) => {
        const res = await axios.post("http://localhost:4000/auth/login", {email, password})
        if (!res.data?.token || !res.data?.user) {
            throw new Error(res.data?.message || "Login failed");
        }
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        return res.data.user;
    }

    //Logout Function
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    }

    //Return Context Provider with user and auth functions
    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout}}>
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;
