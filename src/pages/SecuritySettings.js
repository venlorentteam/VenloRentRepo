// settings/SecuritySettings.js
import React, { useState } from 'react'
import { ClickButton } from '../exports'
import { FiEye, FiEyeOff, FiShield } from 'react-icons/fi'

const SecuritySettings = () => {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [isChanging, setIsChanging] = useState(false)

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setPasswords(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validatePasswords = () => {
    const newErrors = {}
    
    if (!passwords.currentPassword) {
      newErrors.currentPassword = 'Current password is required'
    }
    
    if (!passwords.newPassword) {
      newErrors.newPassword = 'New password is required'
    } else if (passwords.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters'
    } else if (!/(?=.*[A-Z])(?=.*[0-9])/.test(passwords.newPassword)) {
      newErrors.newPassword = 'Password must contain uppercase letter and number'
    }
    
    if (!passwords.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (passwords.newPassword !== passwords.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChangePassword = async () => {
    if (!validatePasswords()) return

    setIsChanging(true)
    try {
      // TODO: API call to change password
      await new Promise(resolve => setTimeout(resolve, 1500))
      alert('Password changed successfully! Please login again.')
      // Clear form
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
      // TODO: Logout user
    } catch (error) {
      console.error('Error changing password:', error)
      setErrors({ submit: 'Failed to change password. Please try again.' })
    } finally {
      setIsChanging(false)
    }
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2>Security & Privacy</h2>
        <p className="settings-subtitle">Manage your password and privacy settings</p>
      </div>

      {/* Change Password Section */}
      <div className="settings-section">
        <h3 className="section-title">Change Password</h3>
        
        <div className="form-group">
          <label className="form-label">Current Password</label>
          <div className="password-input-wrapper">
            <input
              type={showPasswords.current ? "text" : "password"}
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={handleChange}
              className={`profile-input ${errors.currentPassword ? 'input-error' : ''}`}
              placeholder="Enter current password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => togglePasswordVisibility('current')}
            >
              {showPasswords.current ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          {errors.currentPassword && <span className="error-message">{errors.currentPassword}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">New Password</label>
          <div className="password-input-wrapper">
            <input
              type={showPasswords.new ? "text" : "password"}
              name="newPassword"
              value={passwords.newPassword}
              onChange={handleChange}
              className={`profile-input ${errors.newPassword ? 'input-error' : ''}`}
              placeholder="Enter new password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => togglePasswordVisibility('new')}
            >
              {showPasswords.new ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
          <p className="input-hint">Must be at least 8 characters with uppercase and number</p>
        </div>

        <div className="form-group">
          <label className="form-label">Confirm New Password</label>
          <div className="password-input-wrapper">
            <input
              type={showPasswords.confirm ? "text" : "password"}
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handleChange}
              className={`profile-input ${errors.confirmPassword ? 'input-error' : ''}`}
              placeholder="Confirm new password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => togglePasswordVisibility('confirm')}
            >
              {showPasswords.confirm ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
        </div>

        {errors.submit && (
          <div className="error-banner">{errors.submit}</div>
        )}

        <div className="settings-actions">
          <ClickButton
            text={isChanging ? "Changing Password..." : "Change Password"}
            onClick={handleChangePassword}
            disabled={isChanging}
            isLoading={isChanging}
            variant="primary"
            size="large"
          />
        </div>
      </div>

      {/* Privacy Settings Section */}
      <div className="settings-section">
        <h3 className="section-title">Privacy</h3>
        
        <div className="privacy-item">
          <div className="privacy-info">
            <FiShield className="privacy-icon" />
            <div>
              <h4>Account Visibility</h4>
              <p>Your profile is currently <strong>Public</strong></p>
            </div>
          </div>
        </div>

        <div className="privacy-item">
          <div className="privacy-info">
            <div>
              <h4>Data Download</h4>
              <p>Request a copy of your personal data</p>
            </div>
          </div>
          <ClickButton
            text="Request Data"
            variant="outline"
            size="small"
            onClick={() => alert('Data download request submitted')}
          />
        </div>

        <div className="privacy-item danger-zone">
          <div className="privacy-info">
            <div>
              <h4>Delete Account</h4>
              <p className="danger-text">Permanently delete your account and all data</p>
            </div>
          </div>
          <ClickButton
            text="Delete Account"
            variant="danger"
            size="small"
            onClick={() => {
              if (window.confirm('Are you sure? This action cannot be undone.')) {
                alert('Account deletion initiated')
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default SecuritySettings