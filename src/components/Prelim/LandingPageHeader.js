import React from 'react'
import { Link } from 'react-router-dom'
import './LandingPageHeader.css'
import { useAuth } from "../../context/AuthProvider"
import logo from '../../assets/img/venlorent-logo.png'
const LandingPageHeader = (
    {   openGateModal,
        navigation = [
            { name: "Features", href: "#features" },
            { name: "Listings", href: "#listings" },
            { name: "How It Works", href: "#how" },
        ],
        btns = [
            { name: "Log In", href: "/login", type: "ghost" },
            { name: "Get Started", href: "/register", type: "primary" },
        ]
    }) => {
    const { user } = useAuth()
  return (
    <>
        {/* == NAV ================================= */}
        <nav className="landing-nav">
            <div className="landing-nav-inner">
                <Link to="/">
                    {/* <span className="landing-logo-dot" /> */}
                    <img src={logo} alt="VenloRent" className="landing-nav-logo" />
                </Link>
                <div className="landing-nav-links">
                {(navigation) && navigation.map((item) => (
                    <Link key={item.name} to={item.href} className="landing-nav-link">{item.name}</Link>
                ))}
                </div>
                <div className="landing-nav-ctas">
                {(btns) && btns.map((btn) => {
                    // If this is the Login button AND user is logged in → replace it
                    if (user && btn.href === "/login") {
                        return (
                            <Link
                                key="dashboard"
                                to="/dashboard"
                                className="btn btn-primary"
                            >
                            Dashboard
                            </Link>
                        )
                    }
                    return(
                        <Link 
                            key={btn.name}
                            to={btn.href}
                            className={`btn btn-${btn.type || 'primary'}`}
                        >
                            {btn.name}
                        </Link>
                    )
                })} 
                </div>
                {/* Mobile hamburger placeholder */}
                <button className="landing-nav-hamburger" onClick={openGateModal} aria-label="menu">
                <span /><span /><span />
                </button>
            </div>
        </nav>   
    </>
  )
}

export default LandingPageHeader