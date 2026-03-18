import React from 'react'
import "./PrelimHeader.css"
import logo from '../../assets/img/venlorent-light.png'

function PrelimHeader({ pageTitle, pageSubTitle }) {
  return (
    <div className="prelim-header">
      {/* Logo */}
      <div className="logo-container">
        <img 
          className="login-logo-img" 
          src={logo} 
          alt="VenloRent Logo" 
        />
        {/* <h1 className="logo-text">VenloRent</h1> */}
      </div>
      
      {/* Page Title & Subtitle */}
      {pageTitle && (
        <h2 className="page-title">{pageTitle}</h2>
      )}
      {pageSubTitle && (
        <p className="page-sub-title">{pageSubTitle}</p>
      )}
    </div>
  )
}

export default PrelimHeader
