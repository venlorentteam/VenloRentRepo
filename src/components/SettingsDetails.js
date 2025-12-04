import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './SettingsDetails.css'

const SettingsDetails = () => {
  const { settingId } = useParams() // Get which setting to display from URL
  const navigate = useNavigate()

  // Handle back button (mobile only)
  const handleBack = () => {
    navigate(-1); 
  }

  const renderContent = () => {
    switch(settingId) {
      case 'profile':
        return (
          <div>
            <h2>Profile Settings</h2>
            <p>Profile content goes here</p>
          </div>
        )
      case 'upgrade':
        return (
          <div>
            <h2>Upgrade to Premium</h2>
            <p>Upgrade content goes here</p>
          </div>
        )
      case 'kyc':
        return (
          <div>
            <h2>Identity Verification</h2>
            <p>KYC content goes here</p>
          </div>
        )
      case 'follow':
        return (
          <div>
            <h2>Follow and Invite Friends</h2>
            <p>Follow content goes here</p>
          </div>
        )
      case 'friends':
        return (
          <div>
            <h2>Friend Requests</h2>
            <p>Friend requests content goes here</p>
          </div>
        )
      case 'language':
        return (
          <div>
            <h2>Language & Region</h2>
            <p>Language settings go here</p>
          </div>
        )
      case 'ads':
        return (
          <div>
            <h2>Ads Settings</h2>
            <p>Ads content goes here</p>
          </div>
        )
      case 'blocked':
        return (
          <div>
            <h2>Blocked Users</h2>
            <p>Blocked users list goes here</p>
          </div>
        )
      case 'security':
        return (
          <div>
            <h2>Security and Privacy</h2>
            <p>Security settings go here</p>
          </div>
        )
      case 'help':
        return (
          <div>
            <h2>Help Centre</h2>
            <p>Help content goes here</p>
          </div>
        )
      case 'terms':
        return (
          <div>
            <h2>Terms and Policies</h2>
            <p>Terms content goes here</p>
          </div>
        )
      default:
        return (
          <div>
            <h2>Setting Not Found</h2>
            <p>The setting you're looking for doesn't exist.</p>
          </div>
        )
    }
  }

  return (
    <div className="settings-detail-container">
      {/* Mobile: Show back button */}
      <div className="mobile-header">
        <button onClick={handleBack} className="back-button">
          ← Back
        </button>
      </div>

      {/* Render the actual content */}
      <div className="settings-content">
        {renderContent()} {/* Render the contents of the menu*/}
      </div>
    </div>
  )
}

export default SettingsDetails