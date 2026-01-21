import React from 'react'
import { Link } from 'react-router-dom'
import "./PrelimFooter.css"

function PrelimFooter() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="prelim-footer">
      <div className="footer-content">
        {/* Footer Links */}
        <nav className="footer-links" aria-label="Footer navigation">
          <Link to="/about" className="footer-link">About</Link>
          <Link to="/help" className="footer-link">Help Center</Link>
          <Link to="/terms" className="footer-link">Terms of Service</Link>
          <Link to="/privacy-policy" className="footer-link">Privacy Policy</Link>
        </nav>
        
        {/* Copyright */}
        <p className="footer-copyright">
          © {currentYear} VenloRent. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default PrelimFooter