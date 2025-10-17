import React from 'react'
import { Link } from 'react-router-dom'
import "./PrelimFooter.css"
function PrelimFooter() {
  return (
    <div className="footer-links">
      {/* Should contain footer links for preliminary pages */}
      <Link to="/about">About</Link>
      <Link to="/help">Help Center</Link>
      <Link to="/terms">Terms of Service</Link>
    </div>
  )
}

export default PrelimFooter
