import React from 'react'
import { useNavigate } from 'react-router-dom'
import "../assets/css/global.css"
import { PrelimFooter } from '../exports'
import { IoHomeOutline, IoArrowBack, IoSearchOutline, IoMailOutline } from "react-icons/io5"
import { RiHome6Line } from "react-icons/ri"
import "./NoMatch.css"

function NoMatch() {
  const navigate = useNavigate()
  
  const handleGoHome = () => {
    navigate('/dashboard')
  }
  
  const handleGoBack = () => {
    navigate(-1)
  }
  
  const handleSearch = () => {
    navigate('/search')
  }

  const handleContact = () => {
    navigate('/account/help')
  }

  return (
    <>
      <div className="nomatch-page">
        {/* Animated Background */}
        <div className="nomatch-background">
          <div className="bg-circle bg-circle-1"></div>
          <div className="bg-circle bg-circle-2"></div>
          <div className="bg-circle bg-circle-3"></div>
        </div>

        <div className="nomatch-container">
          {/* Main Content Card */}
          <div className="nomatch-content">
            {/* Error Code Display */}
            <div className="error-code-display">
              <h1 className="error-code">404</h1>
              <div className="error-code-underline"></div>
            </div>

            {/* Animated House Icon */}
            <div className="error-icon-wrapper">
              <div className="error-icon">
                <RiHome6Line />
              </div>
              <div className="icon-pulse"></div>
            </div>

            {/* Error Message */}
            <div className="error-message">
              <h2 className="error-title">Oops! Property Not Found</h2>
              <p className="error-description">
                Looks like this page has been rented out or demolished. Don't worry, we'll help you find your way back home.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="error-actions">
              <button 
                className="action-btn primary-btn"
                onClick={handleGoHome}
              >
                <IoHomeOutline />
                <span>Go to Home</span>
              </button>
              
              <button 
                className="action-btn secondary-btn"
                onClick={handleSearch}
              >
                <IoSearchOutline />
                <span>Search Properties</span>
              </button>
              
              <button 
                className="action-btn outline-btn"
                onClick={handleGoBack}
              >
                <IoArrowBack />
                <span>Go Back</span>
              </button>
            </div>

            {/* Divider */}
            <div className="content-divider"></div>

            {/* Quick Links */}
            <div className="quick-links">
              <p className="quick-links-label">Popular pages:</p>
              <div className="links-grid">
                <a href="/dashboard" className="quick-link">
                  <IoHomeOutline />
                  <span>Home</span>
                </a>
                <a href="/search" className="quick-link">
                  <IoSearchOutline />
                  <span>Search</span>
                </a>
                <a href="/inbox" className="quick-link">
                  <IoMailOutline />
                  <span>Messages</span>
                </a>
                <a href="/profile" className="quick-link">
                  <IoHomeOutline />
                  <span>Profile</span>
                </a>
              </div>
            </div>

            {/* Help Section */}
            <div className="help-section">
              <p className="help-text">
                Still can't find what you're looking for?{' '}
                <button onClick={handleContact} className="help-link">
                  Contact Support
                </button>
              </p>
            </div>
          </div>
        </div>

        <PrelimFooter />
      </div>
    </>
  )
}

export default NoMatch