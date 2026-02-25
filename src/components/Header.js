import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { MdKeyboardBackspace } from "react-icons/md"
import './Header.css'

function Header({ backIcon = false, pageTitle, icons = [], button, menuIcon = {} }) {
  const navigate = useNavigate()
  
  const handleBack = () => {
    navigate(-1)
  }

  return (
    <header className="app-header">
      {/* Left Section */}
      <div className="header-left">
        {backIcon && (
          <button 
            className="header-icon header-back-btn" 
            onClick={handleBack}
            aria-label="Go back"
          >
            <MdKeyboardBackspace />
          </button>
        )}
        {pageTitle && (
          <div className="header-title">
            {pageTitle}
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="header-right">
        {/* Dynamic Icons */}
        {icons.map((item, index) => (
          <div key={index} className="header-icon header-action-icon">
            {item.link ? (
              <Link to={item.link} aria-label={item.label || `Navigate to ${item.link}`}>
                {item.element}
              </Link>
            ) : (
              item.element
            )}
          </div>
        ))}

        {/* Optional Button */}
        {button && (
          <div className="header-button">
            {button}
          </div>
        )}

        {/* Menu Icon (Hamburger) */}
        {menuIcon?.element && (
          <div className="header-icon header-menu-icon">
            {menuIcon.link ? (
              <Link to={menuIcon.link} aria-label="Menu">
                {menuIcon.element}
              </Link>
            ) : (
              menuIcon.element
            )}
          </div>
        )}
      </div>
    </header>
  )
}

export default Header