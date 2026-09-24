// settings/AccountSettings.js
import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { ClickButton } from '../exports'
import { FiCamera, FiSave } from 'react-icons/fi'
import { useAuth } from "../context/AuthProvider"
import { API_BASE } from '../config/api'
import Modal from '../components/Modal'

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

  const originalDataRef = useRef({})

  // Email-confirmation modal state
  const [ showEmailConfirmModal, setShowEmailConfirmModal ] = useState(false)
  const [ pendingEmailAddress, setPendingEmailAddress ] = useState('')
  const [ confirmOtp, setConfirmOtp ] = useState('')
  const [ confirmError, setConfirmError ] = useState('')
  const [ isConfirming, setIsConfirming ] = useState(false)
  const [ resendCooldown, setResendCooldown ] = useState(0)

  useEffect(() => {
    if (user) {
      const original = {
        fullName: user.fullName || '',
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        country: user.country || '',
      }
      setFormData(original)
      originalDataRef.current = original
      setAvatarPreview(user.avatar)

      // Resume an unfinished email confirmation from a previous session
      if (user.pendingEmail) {
        setPendingEmailAddress(user.pendingEmail)
      }
    }
  }, [user])

  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setTimeout(() => setResendCooldown((s) => s - 1), 1000)
    return () => clearTimeout(timer)
  }, [resendCooldown])

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

    const emailChanged = email !== originalDataRef.current.email
    const usernameChanged = username !== originalDataRef.current.username

    // Only check email availability if it changed AND is a valid format
    const emailValid = emailChanged && email && /^\S+@\S+\.\S+$/.test(email)
    // Only check username availability if it changed AND is a valid format
    const usernameValid = usernameChanged && username && /^[a-zA-Z0-9_]+$/.test(username) && username.length >= 3

    // Nothing valid to check, cancel — also clears any stale error if the field was reverted
    if (!emailValid && !usernameValid) {
      setErrors((prev) => ({
        ...prev,
        ...(emailChanged ? {} : { email: '' }),
        ...(usernameChanged ? {} : { username: '' }),
      }))
      return
    }

    try {
      const payload = { excludeId: user._id || user.id }
      if (emailValid) payload.email = email
      if (usernameValid) payload.username = username

      const res = await axios.post(`${API_BASE}/auth/check-user`, payload)
      setErrors((prev) => ({
        ...prev,
        email: emailValid ? (res.data.emailExists ? "Email already in use" : "") : prev.email,
        username: usernameValid ? (res.data.usernameExists ? "Username already in use" : "") : prev.username,
      }))
    } catch {
      setErrors((prev) => ({
        ...prev,
        email: emailValid ? "Error checking Email availability" : prev.email,
        username: usernameValid ? "Error checking Username availability" : prev.username,
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
    // if (!formData.username.trim()) {
    //   newErrors.username = 'Username is required'
    // }  
    if (formData.username && !/^@?[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address'
    }
    // if (!formData.phone.trim()) {
    //   newErrors.phone = 'Phone number is required'
    // }
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required'
    }

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    const changedFields = {}
    Object.keys(formData).forEach((key) => {
      if (formData[key].trim() !== originalDataRef.current[key].trim()) {
        changedFields[key] = formData[key].trim()
      }
    })

    // Nothing changed and no new avatar — skip the request entirely
    if (Object.keys(changedFields).length === 0 && !avatarFile) {
      setIsEditing(false)
      return
    }

    // if (Object.keys(newErrors).length === 0) {
    setIsSaving(true)
    try {
      //API call to update profile
      const token = localStorage.getItem('token');

      // Use FormData so the file upload works alongside text fields
      const payload = new FormData();
      Object.entries(changedFields).forEach(([key, value]) => payload.append(key, value))
      if (avatarFile) payload.append("avatar", avatarFile)

      const res = await axios.patch(`${API_BASE}/edit-account`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.data.success) {
        updateUser(res.data.user)
        originalDataRef.current = { ...originalDataRef.current, ...changedFields }
      }
      setAvatarFile(null)
      setIsEditing(false)
      // Show success message
      setSubmitSuccess(res.data.message)

      if (res.data.pendingEmailConfirmation) {
        setPendingEmailAddress(changedFields.email)
        setShowEmailConfirmModal(true)
      }
    } catch (err) {
      setErrors(prev => ({...prev, submit: err.response?.data?.message || err.message || "Failed to update account"}))
      //alert('Failed to update profile. Please try again.')
    } finally {
      setIsSaving(false)
    }
    //}
  }

  // Resend OTP for email confirmation
  const handleResendCode = async () => {
    if (resendCooldown > 0) return
    setIsConfirming(true)
    setConfirmError('')
    try {
      const token = localStorage.getItem('token')
      const res = await axios.post(
        `${API_BASE}/resend-email-change-otp`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (res.data.success) {
        setConfirmOtp('')                    // clear any stale code
        setConfirmError('')
        setResendCooldown(30)
        setSubmitSuccess("A new code was sent to " + pendingEmailAddress)
      }
    } catch (err) {
      setConfirmError(err.response?.data?.message || "Failed to resend code")
    } finally {
      setIsConfirming(false)
    }
  }

  const handleConfirmEmailChange = async () => {
    if (!confirmOtp.trim()) {
      setConfirmError("Enter the code we sent you")
      return
    }
    setIsConfirming(true)
    setConfirmError('')
    try {
      const token = localStorage.getItem('token')
      const res = await axios.post(`${API_BASE}/confirm-email-change`, { otp: confirmOtp.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (res.data.success) {
        // The confirmation endpoint returns { success, message }, not a user object.
        // The pending address is the email the server has just promoted to user.email.
        const confirmedEmail = pendingEmailAddress
        updateUser({ email: confirmedEmail, pendingEmail: null })
        originalDataRef.current = { ...originalDataRef.current, email: confirmedEmail }
        setShowEmailConfirmModal(false)
        setConfirmOtp('')
        setPendingEmailAddress('')
        setSubmitSuccess("Email confirmed and updated")
      }
    } catch (err) {
      setConfirmError(err.response?.data?.message || "Invalid or expired code")
    } finally {
      setIsConfirming(false)
    }
  }

  const handleCloseModal = () => {
    setShowEmailConfirmModal(false)
    setConfirmOtp('')
    setConfirmError('')
    // pendingEmailAddress stays set — the reminder chip below picks it back up
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

        {/* Pending email chip */}
        {pendingEmailAddress && !showEmailConfirmModal && (
          <div className="pending-email-chip">
            <span>Pending confirmation for <strong>{pendingEmailAddress}</strong></span>
            <button type="button" onClick={() => setShowEmailConfirmModal(true)}>
              Verify now
            </button>
          </div>
        )}

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
      <Modal
        isOpen={showEmailConfirmModal}
        onClose={handleCloseModal}
        title="Confirm your new email"
        cancel={true}
      >
        <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          We sent a 6-digit code to <strong>{pendingEmailAddress}</strong>.
          Enter it below to complete the change. Your current email stays
          active until then.
        </p>
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={confirmOtp}
          onChange={(e) => {
            setConfirmOtp(e.target.value.replace(/\D/g, ''))
            if (confirmError) setConfirmError('')
          }}
          placeholder="000000"
          className={`profile-input ${confirmError ? 'input-error' : ''}`}
          style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '1.25rem' }}
        />
        {confirmError && <span className="error-message">{confirmError}</span>}
        <div className="modal-btns-cont">
          <ClickButton
            text={isConfirming ? "Confirming..." : "Confirm Email"}
            onClick={handleConfirmEmailChange}
            disabled={isConfirming}
            isLoading={isConfirming}
            variant="primary"
            size="large"
          />
          <button
            type="button"
            onClick={handleResendCode}
            disabled={isConfirming}
            style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontSize: '0.85rem' }}
          >
           {resendCooldown > 0 ? `Resend available in ${resendCooldown}s` : "Didn't get a code? Resend"}
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default AccountSettings
