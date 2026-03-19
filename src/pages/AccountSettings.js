// settings/AccountSettings.js
import React, { useState } from 'react'
import { ClickButton } from '../exports'
import { FiCamera, FiSave } from 'react-icons/fi'

const AccountSettings = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    fullName: 'Obinabo Walter',
    username: '@walcode',
    email: 'walter@venlorent.com',
    phone: '+234 810 000 0000',
    bio: 'Software Developer & Real Estate Enthusiast',
    avatar: 'https://i.pravatar.cc/100?img=1'
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // TODO: Upload to Cloudinary
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    } else if (!/^@?[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setIsSaving(true)
    try {
      // TODO: API call to update profile
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsEditing(false)
      // Show success message
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    // Reset form data to original values
    // TODO: Fetch from state/context
    setIsEditing(false)
    setErrors({})
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2>Account Settings</h2>
        <p className="settings-subtitle">Manage your profile information</p>
      </div>

      <div className="settings-section">
        {/* Avatar Section */}
        <div className="avatar-section">
          <div className="avatar-wrapper">
            <img src={formData.avatar} alt="Profile" className="settings-avatar" />
            {isEditing && (
              <label className="avatar-upload-btn">
                <FiCamera />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAvatarChange}
                  style={{ display: 'none' }}
                />
              </label>
            )}
          </div>
          <div className="avatar-info">
            <h4>{formData.fullName}</h4>
            <p>{formData.username}</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            disabled={!isEditing}
            className={`profile-input ${errors.fullName ? 'input-error' : ''}`}
            placeholder="Enter your full name"
          />
          {errors.fullName && <span className="error-message">{errors.fullName}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            disabled={!isEditing}
            className={`profile-input ${errors.username ? 'input-error' : ''}`}
            placeholder="@username"
          />
          {errors.username && <span className="error-message">{errors.username}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!isEditing}
            className={`profile-input ${errors.email ? 'input-error' : ''}`}
            placeholder="email@example.com"
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={!isEditing}
            className={`profile-input ${errors.phone ? 'input-error' : ''}`}
            placeholder="+234 000 000 0000"
          />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Bio (Optional)</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            disabled={!isEditing}
            className={`profile-input profile-textarea`}
            placeholder="Tell us about yourself..."
            rows="4"
            maxLength="100"
          />
          <span className="char-count">{formData.bio.length}/100</span>
        </div>

        {/* Action Buttons */}
        <div className="settings-actions">
          {!isEditing ? (
            <ClickButton
              text="Edit Profile"
              onClick={() => setIsEditing(true)}
              variant="primary"
              size="large"
            />
          ) : (
            <>
              <ClickButton
                text="Cancel"
                onClick={handleCancel}
                variant="outline"
                size="large"
              />
              <ClickButton
                text={isSaving ? "Saving..." : "Save Changes"}
                icon={<FiSave />}
                onClick={handleSave}
                disabled={isSaving}
                isLoading={isSaving}
                variant="primary"
                size="large"
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AccountSettings