// settings/NotificationSettings.js
import React, { useState } from 'react'

const NotificationSettings = () => {
  const [preferences, setPreferences] = useState({
    newMessages: true,
    orderUpdates: true,
    paymentConfirmations: true,
    followedAgentListings: true,
    verificationStatus: true,
    marketingEmails: false,
    pushNotifications: true,
    emailNotifications: true
  })

  const handleToggle = async (key) => {
    const newValue = !preferences[key]
    setPreferences(prev => ({ ...prev, [key]: newValue }))
    
    // TODO: Save to backend
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      console.log(`Updated ${key} to ${newValue}`)
    } catch (error) {
      console.error('Error updating preference:', error)
      // Revert on error
      setPreferences(prev => ({ ...prev, [key]: !newValue }))
    }
  }

  const notificationGroups = [
    {
      title: 'Activity Notifications',
      items: [
        { key: 'newMessages', label: 'New Messages', description: 'Get notified when you receive a new message' },
        { key: 'orderUpdates', label: 'Order Updates', description: 'Updates on your property orders' },
        { key: 'paymentConfirmations', label: 'Payment Confirmations', description: 'Receive payment receipts and confirmations' },
      ]
    },
    {
      title: 'Discovery',
      items: [
        { key: 'followedAgentListings', label: 'Followed Agent Listings', description: 'New listings from agents you follow' },
        { key: 'verificationStatus', label: 'Verification Status', description: 'Updates on your verification application' },
      ]
    },
    {
      title: 'Marketing',
      items: [
        { key: 'marketingEmails', label: 'Marketing Emails', description: 'Promotional offers and updates' },
      ]
    },
    {
      title: 'Notification Channels',
      items: [
        { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive notifications on your device' },
        { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
      ]
    }
  ]

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2>Notification Settings</h2>
        <p className="settings-subtitle">Manage how you receive notifications</p>
      </div>

      {notificationGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="settings-section">
          <h3 className="section-title">{group.title}</h3>
          
          {group.items.map((item) => (
            <div key={item.key} className="notification-item">
              <div className="notification-info">
                <h4 className="notification-label">{item.label}</h4>
                <p className="notification-description">{item.description}</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={preferences[item.key]}
                  onChange={() => handleToggle(item.key)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          ))}
        </div>
      ))}

      <div className="settings-info">
        <p>Changes are saved automatically</p>
      </div>
    </div>
  )
}

export default NotificationSettings