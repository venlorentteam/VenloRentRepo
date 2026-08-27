import React, { useState } from 'react'
import axios from 'axios'
import { ClickButton } from '../exports'
import { FiUpload, FiCheckCircle, FiClock, FiXCircle, FiInfo, FiShield, FiFileText } from 'react-icons/fi'
import { MdOutlineLocationOn } from 'react-icons/md'
import { BsBuildingCheck, BsPersonBadge } from 'react-icons/bs'
import { useAuth } from "../context/AuthProvider"
import { API_BASE } from '../config/api'

const statusMap = {
  unsubmitted: 'unverified',
  submitted: 'pending',
  in_review: 'pending',
  verified: 'approved',
  rejected: 'rejected',
}

const VerificationSettings = () => {
  const { user, updateUser } = useAuth()
  
  const verificationStatus = statusMap[user?.kycStatus] || 'unverified'
  const [documents, setDocuments] = useState({
    businessProof: null,
  })
  const [previews, setPreviews] = useState({
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
    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, [field]: 'Only JPG, PNG, or PDF files allowed' }))
      return
    }
    if (file.size > maxSize) {
      setErrors(prev => ({ ...prev, [field]: 'File must be under 5MB' }))
      return
    }

    setDocuments(prev => ({ ...prev, [field]: file }))
    setErrors(prev => ({ ...prev, [field]: '' }))

    // Generate preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => setPreviews(prev => ({ ...prev, [field]: reader.result }))
      reader.readAsDataURL(file)
    } else {
      // PDF — show filename as preview
      setPreviews(prev => ({ ...prev, [field]: 'pdf' }))
    }
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
        `${API_BASE}/auth/kyc/submit-documents`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      
      if (res.data.success && res.data.diditUrl) {
        window.location.href = res.data.diditUrl //take user to Didit for identity verification
        updateUser({ kycStatus: 'submitted' })
      } else {
        setErrors({
          submit: "Verification session was created but we couldn't get the redirect URL. Please try again.",
        })
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

      {/* Enhanced KYC Information Section */}
      <div className="kyc-info-section">
        <div className="kyc-info-header">
          <BsBuildingCheck className="kyc-info-icon" />
          <div>
            <h3>Become a Verified Agent</h3>
            <p>Complete your KYC to unlock full agent features - create listings, receive messages, and build trust with clients.</p>
          </div>
        </div>

        <div className="kyc-benefits">
          <div className="benefit-item">
            <FiShield className="benefit-icon" />
            <div>
              <h4>Verified Badge</h4>
              <p>Display a verified badge on your profile and listings</p>
            </div>
          </div>
          <div className="benefit-item">
            <FiFileText className="benefit-icon" />
            <div>
              <h4>Create Listings</h4>
              <p>Post property listings for rent, sale, and shortlet</p>
            </div>
          </div>
          <div className="benefit-item">
            <MdOutlineLocationOn className="benefit-icon" />
            <div>
              <h4>Direct Messages</h4>
              <p>Receive inquiries directly from interested clients</p>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="section-title">Business Information</h3>
        <p className="section-desc">Tell us about your real estate business</p>
        
        <div className="form-group">
          <label className="form-label">Business / Agency name</label>
          <div className="input-wrapper">
            <BsPersonBadge className="input-icon-left" />
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              className={`form-input ${errors.businessName ? 'input-error' : ''}`}
              placeholder="e.g. Adeyemi Properties Ltd"
            />
          </div>
          {errors.businessName && <span className="error-message">{errors.businessName}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Office address</label>
          <div className="input-wrapper">
            <MdOutlineLocationOn className="input-icon-left" />
            <input
              type="text"
              name="officeAddress"
              value={formData.officeAddress}
              onChange={handleChange}
              className={`form-input ${errors.officeAddress ? 'input-error' : ''}`}
              placeholder="Your office address"
            />
          </div>
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
      </div>

      <div className="settings-section">
        <h3 className="section-title">Required Documents</h3>
        <p className="section-desc">Upload proof of your business legitimacy</p>
        
        <div className="document-requirements">
          <div className="requirement-item">
            <FiInfo className="requirement-icon" />
            <div>
              <h4>Business Proof</h4>
              <p>Upload one of the following:</p>
              <ul>
                <li>Certificate of Incorporation (CAC)</li>
                <li>Business registration certificate</li>
                <li>Professional license or certification</li>
                <li>Business card with company details</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="upload-grid">
          <div className="upload-item">
            <label className="upload-label">
              <FiUpload className="upload-icon" />
              <span>Business Proof Document</span>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFileChange('businessProof', e.target.files[0])}
                style={{ display: 'none' }}
              />
            </label>
            {documents.businessProof && (
              <div className="file-preview">
                {previews.businessProof === 'pdf' ? (
                  <FiFileText className="file-icon" />
                ) : (
                  <img src={previews.businessProof} alt="Preview" className="file-image" />
                )}
                <span className="file-name">{documents.businessProof.name}</span>
              </div>
            )}
            {errors.businessProof && <span className="error-message">{errors.businessProof}</span>}
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="section-title">Identity Verification</h3>
        <p className="section-desc">Complete secure identity verification with our partner</p>
        
        <div className="identity-info">
          <div className="identity-benefits">
            <div className="benefit-check">
              <FiCheckCircle />
              <span>AI-powered ID verification</span>
            </div>
            <div className="benefit-check">
              <FiCheckCircle />
              <span>Secure biometric checks</span>
            </div>
            <div className="benefit-check">
              <FiCheckCircle />
              <span>Instant results</span>
            </div>
          </div>
          <p className="identity-desc">
            After submitting your documents, you'll be redirected to our verification partner. 
            You'll complete a quick liveness check and ID scan. This takes about 2-3 minutes.
          </p>
        </div>
      </div>

      {errors.submit && (
        <div className="submit-error">
          {errors.submit}
        </div>
      )}

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
  )
}

export default VerificationSettings