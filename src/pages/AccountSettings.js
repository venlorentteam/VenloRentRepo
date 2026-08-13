// settings/AccountSettings.js
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ClickButton } from '../exports'
import { FiCamera, FiSave } from 'react-icons/fi'
import { useAuth } from "../context/AuthProvider"
import { API_BASE } from '../config/api'

const AccountSettings = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [avatarFile, setAvatarFile] = useState(null) // the actual File object
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [errors, setErrors] = useState({})
  const [submitSuccess, setSubmitSuccess] = useState("")
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    bio: '',
    country: '',
  })

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        country: user.country || '',
      })
      setAvatarPreview(user.avatar)
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // Check if user exists on blur of email and username fields
  const checkUserAvailability = async () => {
    const email = formData.email.trim()
    const username = formData.username.trim()
   
    // Only check email availability if it's a valid format
    const emailValid = email && /^\S+@\S+\.\S+$/.test(email)
    // Only check username availability if it's a valid format  
    const usernameValid = username && /^[a-zA-Z0-9_]+$/.test(username) && username.length >= 3

    // Nothing valid to check, cancel
    if (!emailValid && !usernameValid) return

    try {
      const payload = {}
      if (emailValid) payload.email = email
      if (usernameValid) payload.username = username
      
      const res = await axios.post(`${API_BASE}/auth/check-user`, payload)
      setErrors((prev) => ({
        ...prev,
        email: res.data.emailExists ? "Email already in use" : "",
        username: res.data.usernameExists ? "Username already in use" : "",
      }))
    } catch {
      setErrors((prev) => ({
        ...prev,
        email: "Error checking Email availability",
        username: "Error checking Username availability",
      }))
    }
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return;

    // Basic client-side size check (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, avatar: "Image must be under 2MB" }))
      return;
    }

    setAvatarFile(file)
    // Show a local preview immediately — the real URL comes back from the server
    setAvatarPreview(URL.createObjectURL(file))
    if (errors.avatar) setErrors(prev => ({ ...prev, avatar: '' }))
  }

  const handleSave = async () => {
    //Create a new error object
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
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      setIsSaving(true)
      try {
        //API call to update profile
        const token = localStorage.getItem('token');

        // Use FormData so the file upload works alongside text fields
        const payload = new FormData();
        payload.append("fullName", formData.fullName);
        payload.append("username", formData.username);
        payload.append("email", formData.email);
        payload.append("phone", formData.phone);
        payload.append("bio", formData.bio);
        payload.append("country", formData.country);
        if (avatarFile) {
          payload.append("avatar", avatarFile); // must match upload.single("avatar") on the backend
        }

        const res = await axios.patch(`${API_BASE}/edit-account`, 
          payload,
          {headers: {Authorization: `Bearer ${token}`}}
          //Allowing axios to set the correct type of ContentType/multipart
        )
        if (res.data.success) updateUser(res.data.user) //Update the user context
        
        setAvatarFile(null)
        setIsEditing(false)
        // Show success message
        setSubmitSuccess(res.data.message)
      } catch (err) {
        setErrors(prev => ({...prev, submit: err.response?.data?.message || err.message || "Failed to update account"}))
        //alert('Failed to update profile. Please try again.')
      } finally {
        setIsSaving(false)
      }
    }
  }

  const handleCancel = () => {
    // Reset form data to original values
    //Fetch from state/context
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        country: user.country || '',
      });
      setAvatarPreview(user.avatar);
    }
    setAvatarFile(null)
    setIsEditing(false)
    setErrors({})
    setSubmitSuccess("")
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2>Account Settings</h2>
        <p className="settings-subtitle">Manage your profile information</p>
      </div>

      <div className="settings-section">
        {/* Success message for successful submission */}
        {submitSuccess && (<div className="submit-success">
          {submitSuccess}
        </div>)}
        {/* Avatar Section */}
        <div className="avatar-section">
          <div className="avatar-wrapper">
            <img src={avatarPreview || user?.avatar} alt="Profile" className="settings-avatar" />
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
            <p>@{formData.username}</p>
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
            maxLength="50"
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
            onBlur={checkUserAvailability}
            maxLength="30"
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
            onBlur={checkUserAvailability}
            maxLength="50"
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
            maxLength="30"
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

        <div className="form-group">
          <label className="form-label">Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            disabled={!isEditing}
            className={`profile-input ${errors.country ? 'input-error' : ''}`}
            placeholder="Country"
            maxLength="20"
          />
          {errors.country && <span className="error-message">{errors.country}</span>}
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