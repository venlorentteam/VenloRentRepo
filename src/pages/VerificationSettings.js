import React, { useState } from 'react'
import axios from 'axios'
import { ClickButton } from '../exports'
import { FiUpload, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi'
import { useAuth } from "../context/AuthProvider"

const statusMap = {
  unsubmitted: 'unverified',
  submitted:   'pending',
  in_review:   'pending',
  verified:    'approved',
  rejected:    'rejected',
}

const VerificationSettings = () => {
  const { user, updateUser } = useAuth()
  //const [verificationStatus, setVerificationStatus] = useState('unverified') // unverified, pending, approved, rejected
  // Define statusMap before using it
  
  const verificationStatus = statusMap[user?.kycStatus] || 'unverified'
  const [documents, setDocuments] = useState({
    businessProof: null,
  })
  const [formData, setFormData] = useState({
    businessName: '',
    officeAddress: '',
    yearsExperience: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFileChange = (field, file) => {
    if (file && file.size > 5 * 1024 * 1024) { // 5MB limit
      setErrors(prev => ({ ...prev, [field]: 'File size must be less than 5MB' }))
      return
    }
    setDocuments(prev => ({ ...prev, [field]: file }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!documents.businessProof) newErrors.businessProof = 'Business proof is required'
    if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required'
    if (!formData.officeAddress.trim()) newErrors.officeAddress = 'Office address is required'
    if (!formData.yearsExperience) newErrors.yearsExperience = 'Years of experience is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('token')

      // 1. Upload business info + documents to your backend
      const payload = new FormData()
      payload.append('businessName', formData.businessName)
      payload.append('officeAddress', formData.officeAddress)
      payload.append('yearsExperience', formData.yearsExperience)
      payload.append('addressProof', documents.businessProof)

      const res = await axios.post(
        'https://newprojectbackend-5axx.onrender.com/auth/kyc/submit-documents',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (res.data.success && res.data.diditUrl) {
        // 2. Backend returns Didit verification URL → redirect user
        window.location.href = res.data.diditUrl
        updateUser({ kycStatus: 'submitted' }) //Update user account
      }
      
    } catch (error) {
      setErrors(prev=>({...prev, submit: error?.response?.data?.message || error?.message || "Unable to submit"}))
      console.error('Error submitting verification:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStatusBanner = () => {
    const statuses = {
      unverified: { icon: <FiClock />, color: 'gray', text: 'Not Verified', desc: 'Apply to become a verified agent' },
      pending: { icon: <FiClock />, color: 'amber', text: 'Pending Review', desc: 'Your application is being reviewed' },
      approved: { icon: <FiCheckCircle />, color: 'green', text: 'Verified', desc: 'You are a verified agent' },
      rejected: { icon: <FiXCircle />, color: 'red', text: 'Rejected', desc: 'Please review feedback and resubmit' }
    }

    const status = statuses[verificationStatus]
    return (
      <div className={`status-banner status-${status.color}`}>
        {status.icon}
        <div>
          <h4>{status.text}</h4>
          <p>{status.desc}</p>
        </div>
      </div>
    )
  }

  if (verificationStatus === 'approved') {
    return (
      <div className="settings-page">
        <div className="settings-header">
          <h2>Agent Verification</h2>
          <p className="settings-subtitle">You are verified!</p>
        </div>
        {renderStatusBanner()}
        <div className="verification-success">
          <FiCheckCircle className="success-icon" />
          <h3>Congratulations!</h3>
          <p>You can now create property listings and access all agent features.</p>
        </div>
      </div>
    )
  }

  if (verificationStatus === 'pending') {
    return (
      <div className="settings-page">
        <div className="settings-header">
          <h2>Agent Verification</h2>
          <p className="settings-subtitle">Application under review</p>
        </div>
        {renderStatusBanner()}
        <div className="verification-pending">
          <FiClock className="pending-icon" />
          <h3>Application Submitted</h3>
          <p>We are reviewing your documents. You will be notified via email within 24-48 hours.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2>Agent Verification</h2>
        <p className="settings-subtitle">Apply to become a verified agent</p>
      </div>

      {renderStatusBanner()}

      <div className="settings-section">
        <h3 className="section-title">Required Documents</h3>
        
        <div className="upload-grid">
          <div className="upload-item">
            <label className="upload-label">
              <FiUpload className="upload-icon" />
              <span>Business Proof</span>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFileChange('businessProof', e.target.files[0])}
                style={{ display: 'none' }}
              />
            </label>
            {documents.businessProof && <span className="file-name">{documents.businessProof.name}</span>}
            {errors.businessProof && <span className="error-message">{errors.businessProof}</span>}
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="section-title">Business Information</h3>
        
        <div className="form-group">
          <label className="form-label">Business Name</label>
          <input
            type="text"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            className={`profile-input ${errors.businessName ? 'input-error' : ''}`}
            placeholder="Your business or company name"
          />
          {errors.businessName && <span className="error-message">{errors.businessName}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Office Address</label>
          <input
            type="text"
            name="officeAddress"
            value={formData.officeAddress}
            onChange={handleChange}
            className={`profile-input ${errors.officeAddress ? 'input-error' : ''}`}
            placeholder="Your office address"
          />
          {errors.officeAddress && <span className="error-message">{errors.officeAddress}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Years of Experience</label>
          <select 
            value={formData.yearsExperience}
            name="yearsExperience" 
            onChange={handleChange} 
            className={`form-input form-select ${errors.yearsExperience ? 'input-error' : ''}`}
          >
            <option value="">Select experience</option>
            <option value="0-1">Less than 1 year</option>
            <option value="1-3">1 - 3 years</option>
            <option value="3-5">3 - 5 years</option>
            <option value="5-10">5 - 10 years</option>
            <option value="10+">10+ years</option>
          </select>
          {errors.yearsExperience && <span className="error-message">{errors.yearsExperience}</span>}
        </div>

        <div className="settings-actions">
          <ClickButton
            text={isSubmitting ? "Submitting..." : "Submit Application"}
            onClick={handleSubmit}
            disabled={isSubmitting}
            isLoading={isSubmitting}
            variant="primary"
            size="large"
          />
        </div>
      </div>
    </div>
  )
}

export default VerificationSettings