// ========================================
// settings/AboutSettings.js
// ========================================
import React from 'react'
import { FiExternalLink } from 'react-icons/fi'

const AboutSettings = () => {
  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2>About VenloRent</h2>
        <p className="settings-subtitle">Legal information and app details</p>
      </div>

      <div className="settings-section">
        <div className="about-item">
          <h4>Version</h4>
          <p>1.0.0 (Build 001)</p>
        </div>

        <div className="about-item">
          <h4>Release Date</h4>
          <p>January 2026</p>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="section-title">Legal</h3>
        
        <a href="/terms" className="legal-link">
          <span>Terms of Service</span>
          <FiExternalLink />
        </a>

        <a href="/privacy" className="legal-link">
          <span>Privacy Policy</span>
          <FiExternalLink />
        </a>

        <a href="/community-guidelines" className="legal-link">
          <span>Community Guidelines</span>
          <FiExternalLink />
        </a>
      </div>

      <div className="settings-section">
        <h3 className="section-title">About Us</h3>
        <p className="about-text">
          VenloRent is Nigeria's most trusted real estate marketplace, connecting verified property agents with house seekers through transparent, secure, and efficient transactions.
        </p>
        <p className="about-text">
          Our mission is to eliminate fraud and build trust in Nigeria's real estate market through rigorous verification and platform accountability.
        </p>
      </div>

      <div className="about-footer">
        <p>© 2026 VenloRent. All rights reserved.</p>
      </div>
    </div>
  )
}

export default AboutSettings