// ========================================
// SettingsDetails.js - Router Component
// ========================================
import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AccountSettings from '../pages/AccountSettings'
import NotificationSettings from '../pages/NotificationSettings'
import SecuritySettings from '../pages/SecuritySettings'
import VerificationSettings from '../pages/VerificationSettings'
import SubscriptionSettings from '../pages/SubscriptionSettings'
import HelpSettings from '../pages/HelpSettings'
import AboutSettings from '../pages/AboutSettings'
import './SettingsDetails.css'
import { IoArrowBack } from 'react-icons/io5'

const SettingsDetails = () => {
  const { settingId } = useParams()
  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/account')
  }

  const renderContent = () => {
    switch(settingId) {
      case 'account':
        return <AccountSettings />
      case 'notifications':
        return <NotificationSettings />
      case 'security':
        return <SecuritySettings />
      case 'verification':
        return <VerificationSettings />
      case 'subscription':
        return <SubscriptionSettings />
      case 'help':
        return <HelpSettings />
      case 'about':
        return <AboutSettings />
      default:
        // Default to AccountSettings when no settingId is provided
        return <AccountSettings />
        {/* //   <div className="settings-not-found"> 
          //   <h2>Setting Not Found</h2>
          //   <p>The setting you're looking for doesn't exist.</p>
          //   <button onClick={handleBack} className="back-to-settings">
          //     Back to Settings
          //   </button>
          // </div> */}
        
    }
  }

  return (
    <div className="settings-detail-container">
      <div className="mobile-header">
        <button onClick={handleBack} className="back-button">
          <IoArrowBack /> Back
        </button>
      </div>
      <div className="settings-content">
        {renderContent()}
      </div>
    </div>
  )
}

export default SettingsDetails