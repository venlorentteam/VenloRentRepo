import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './KycFlow.css'
import axios from 'axios'
import { PrelimFooter } from '../exports'
import { MdOutlineBusinessCenter, MdOutlineLocationOn, MdOutlineUploadFile } from 'react-icons/md'
import { BsPersonBadge, BsBuildingCheck } from 'react-icons/bs'
import { HiOutlineIdentification } from 'react-icons/hi'
import { IoCheckmarkCircle } from 'react-icons/io5'
import { RiArrowRightLine, RiArrowLeftLine } from 'react-icons/ri'
import { API_BASE } from '../config/api'

// Step definitions
const STEPS = [
  { id: 1, label: 'Business Info',  icon: <MdOutlineBusinessCenter /> },
  { id: 2, label: 'Documents',      icon: <MdOutlineUploadFile /> },
  { id: 3, label: 'Identity Check', icon: <HiOutlineIdentification /> },
]

function KycFlow() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  // Step 1 data
  const [businessData, setBusinessData] = useState({
    businessName: '',
    officeAddress: '',
    yearsExperience: '',
  })

  // Step 2 data
  const [documents, setDocuments] = useState({
    businessProof: null,  // CAC / business card
  })
  const [previews, setPreviews] = useState({
    businessProof: null,
  })

  // === Step 1 Handlers ========================================
  const handleBusinessChange = (e) => {
    const { name, value } = e.target
    setBusinessData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateStep1 = () => {
    const newErrors = {}
    if (!businessData.businessName.trim()) newErrors.businessName = 'Business name is required'
    if (!businessData.officeAddress.trim()) newErrors.officeAddress = 'Office address is required'
    if (!businessData.yearsExperience) newErrors.yearsExperience = 'Please select your experience'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // === Step 2 Handlers ========================================
  const handleFileChange = (e, docType) => {
    const file = e.target.files[0]
    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, [docType]: 'Only JPG, PNG, or PDF files allowed' }))
      return
    }
    if (file.size > maxSize) {
      setErrors(prev => ({ ...prev, [docType]: 'File must be under 5MB' }))
      return
    }

    setDocuments(prev => ({ ...prev, [docType]: file }))
    setErrors(prev => ({ ...prev, [docType]: '' }))

    // Generate preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => setPreviews(prev => ({ ...prev, [docType]: reader.result }))
      reader.readAsDataURL(file)
    } else {
      // PDF — show filename as preview
      setPreviews(prev => ({ ...prev, [docType]: 'pdf' }))
    }
  }

  const validateStep2 = () => {
    const newErrors = {}
    //if (!documents.idDocument) newErrors.idDocument = 'Government-issued ID is required'
    if (!documents.businessProof) newErrors.businessProof = 'Business proof is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // === Step Navigation ========================================
  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return
    if (currentStep === 2 && !validateStep2()) return
    setCurrentStep(prev => prev + 1)
  }

  const handleBack = () => setCurrentStep(prev => prev - 1)

  // === Final Submit → Didit ========================================
  // Step 3: Submit business info + docs to backend, then redirect to Didit
  const handleSubmitAndRedirectToDidit = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')

      // 1. Upload business info + documents to your backend
      const formData = new FormData()
      formData.append('businessName', businessData.businessName)
      formData.append('officeAddress', businessData.officeAddress)
      formData.append('yearsExperience', businessData.yearsExperience)
      formData.append('addressProof', documents.businessProof)

      const res = await axios.post(
        `${API_BASE}/auth/kyc/submit-documents`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // Removed 'Content-Type': 'multipart/form-data',
            //Since Backend is using multer, it will automatically set the correct Content-Type with boundary when FormData is passed. Setting it manually can cause issues. 
          },
        }
      )

      if (res.data.success && res.data.diditUrl) {
        window.location.href = res.data.diditUrl //take user to Didit for identity verification
      } else {
        setErrors({
          submit: "Verification session was created but we couldn't get the redirect URL. Please try again.",
        })
      }
    } catch (err) {
      setErrors({
        submit: err.response?.data?.message || err.message || 'Something went wrong. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // === Skip KYC (do it later from Settings) ========================================
  const handleSkip = () => navigate('/dashboard')

  // === Render Steps ========================================
  const renderStep = () => {
    switch (currentStep) {
      case 1: return <StepBusinessInfo data={businessData} onChange={handleBusinessChange} errors={errors} />
      case 2: return <StepDocuments documents={documents} previews={previews} onFileChange={handleFileChange} errors={errors} />
      case 3: return <StepIdentityCheck businessData={businessData} documents={documents} isLoading={isLoading} errors={errors} />
      default: return null
    }
  }

  return (
    <>
      <div className="kyc-page">
        <div className="kyc-container">

          {/* Left Panel */}
          <div className="kyc-left">
            <div className="kyc-left-content">
              <div className="kyc-brand">
                <BsBuildingCheck className="kyc-brand-icon" />
                <span className="kyc-brand-name">VenloRent</span>
              </div>

              <div className="kyc-left-text">
                <h2 className="kyc-left-title">Become a Verified Agent</h2>
                <p className="kyc-left-subtitle">
                  Complete your KYC to unlock full agent features - create listings, receive messages, and build trust with clients.
                </p>
              </div>

              {/* Step indicators */}
              <div className="kyc-steps-list">
                {STEPS.map((step) => {
                  const status = step.id < currentStep ? 'done' : step.id === currentStep ? 'active' : 'upcoming'
                  return (
                    <div key={step.id} className={`kyc-step-item kyc-step-item--${status}`}>
                      <div className="kyc-step-dot">
                        {status === 'done'
                          ? <IoCheckmarkCircle />
                          : <span>{step.id}</span>
                        }
                      </div>
                      <div className="kyc-step-info">
                        <span className="kyc-step-label">{step.label}</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              <button className="kyc-skip-btn" onClick={handleSkip}>
                Skip for now - I'll verify later
              </button>
            </div>
          </div>

          {/* Right Panel */}
          <div className="kyc-right">
            <div className="kyc-form-wrapper">

              {/* Mobile step progress */}
              <div className="kyc-mobile-progress">
                <div className="kyc-mobile-progress-bar">
                  <div
                    className="kyc-mobile-progress-fill"
                    style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
                  />
                </div>
                <span className="kyc-mobile-progress-label">Step {currentStep} of {STEPS.length}</span>
              </div>

              {/* Step content */}
              <div className="kyc-step-content">
                {renderStep()}
              </div>

              {/* Navigation buttons */}
              <div className="kyc-nav-buttons">
                {currentStep > 1 && (
                  <button className="kyc-btn-back" onClick={handleBack} disabled={isLoading}>
                    <RiArrowLeftLine /> Back
                  </button>
                )}

                {currentStep < 3 ? (
                  <button className="kyc-btn-next" onClick={handleNext}>
                    Continue <RiArrowRightLine />
                  </button>
                ) : (
                  <button
                    className="kyc-btn-submit"
                    onClick={handleSubmitAndRedirectToDidit}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="kyc-btn-loading">
                        <span className="kyc-spinner" />
                        Submitting...
                      </span>
                    ) : (
                      <>Verify my identity <RiArrowRightLine /></>
                    )}
                  </button>
                )}
              </div>

              {errors.submit && (
                <div className="kyc-submit-error">{errors.submit}</div>
              )}

            </div>
          </div>

        </div>
      </div>
      <PrelimFooter />
    </>
  )
}

// === Step 1: Business Info ========================================
function StepBusinessInfo({ data, onChange, errors }) {
  return (
    <div className="kyc-step">
      <div className="kyc-step-header">
        <div className="kyc-step-icon"><MdOutlineBusinessCenter /></div>
        <div>
          <h3 className="kyc-step-title">Business Information</h3>
          <p className="kyc-step-desc">Tell us about your real estate business</p>
        </div>
      </div>

      <div className="kyc-fields">
        <div className="form-group">
          <label className="form-label">Business / Agency name</label>
          <div className="input-wrapper">
            <BsPersonBadge className="input-icon-left" />
            <input
              className={`form-input ${errors.businessName ? 'input-error' : ''}`}
              type="text"
              name="businessName"
              placeholder="e.g. Adeyemi Properties Ltd"
              value={data.businessName}
              onChange={onChange}
            />
          </div>
          {errors.businessName && <span className="error-message">{errors.businessName}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Office address</label>
          <div className="input-wrapper">
            <MdOutlineLocationOn className="input-icon-left" />
            <input
              className={`form-input ${errors.officeAddress ? 'input-error' : ''}`}
              type="text"
              name="officeAddress"
              placeholder="e.g. 12 Lekki Phase 1, Lagos"
              value={data.officeAddress}
              onChange={onChange}
            />
          </div>
          {errors.officeAddress && <span className="error-message">{errors.officeAddress}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Years of experience</label>
          <select
            className={`form-input form-select ${errors.yearsExperience ? 'input-error' : ''}`}
            name="yearsExperience"
            value={data.yearsExperience}
            onChange={onChange}
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
    </div>
  )
}

// === Step 2: Document Upload ========================================
function StepDocuments({ documents, previews, onFileChange, errors }) {
  return (
    <div className="kyc-step">
      <div className="kyc-step-header">
        <div className="kyc-step-icon"><MdOutlineUploadFile /></div>
        <div>
          <h3 className="kyc-step-title">Upload Documents</h3>
          <p className="kyc-step-desc">JPG, PNG or PDF - Max 5MB per file</p>
        </div>
      </div>

      <div className="kyc-fields">
        {/* <DocumentUpload
          label="Government-issued ID"
          hint="Driver's License, National ID, or International Passport"
          docType="idDocument"
          file={documents.idDocument}
          preview={previews.idDocument}
          onChange={onFileChange}
          error={errors.idDocument}
        /> */}

        <DocumentUpload
          label="Proof of business"
          hint="Upload one of the following: Certificate of Incorporation (CAC), Business registration certificate, Professional license, or Business card with company details"
          docType="businessProof"
          file={documents.businessProof}
          preview={previews.businessProof}
          onChange={onFileChange}
          error={errors.businessProof}
        />
      </div>
    </div>
  )
}

function DocumentUpload({ label, hint, docType, file, preview, onChange, error }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <p className="kyc-doc-hint">{hint}</p>

      <label className={`kyc-upload-zone ${file ? 'kyc-upload-zone--filled' : ''} ${error ? 'kyc-upload-zone--error' : ''}`}>
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={(e) => onChange(e, docType)}
          className="kyc-upload-input"
        />
        {!file ? (
          <div className="kyc-upload-placeholder">
            <MdOutlineUploadFile className="kyc-upload-icon" />
            <span className="kyc-upload-text">Click to upload or drag & drop</span>
          </div>
        ) : (
          <div className="kyc-upload-preview">
            {preview && preview !== 'pdf' ? (
              <img src={preview} alt="Preview" className="kyc-upload-img-preview" />
            ) : (
              <div className="kyc-upload-pdf-preview">
                <MdOutlineUploadFile />
                <span>{file.name}</span>
              </div>
            )}
            <span className="kyc-upload-change">Click to change</span>
          </div>
        )}
      </label>

      {error && <span className="error-message">{error}</span>}
    </div>
  )
}

// === Step 3: Identity Check Summary ========================================
function StepIdentityCheck({ businessData, documents, isLoading, errors }) {
  return (
    <div className="kyc-step">
      <div className="kyc-step-header">
        <div className="kyc-step-icon"><HiOutlineIdentification /></div>
        <div>
          <h3 className="kyc-step-title">Identity Verification</h3>
          <p className="kyc-step-desc">Final step - verify your identity with Didit</p>
        </div>
      </div>

      <div className="kyc-review-summary">
        <h4 className="kyc-review-title">Review your submission</h4>

        <div className="kyc-review-item">
          <span className="kyc-review-label">Business name</span>
          <span className="kyc-review-value">{businessData.businessName}</span>
        </div>
        <div className="kyc-review-item">
          <span className="kyc-review-label">Office address</span>
          <span className="kyc-review-value">{businessData.officeAddress}</span>
        </div>
        <div className="kyc-review-item">
          <span className="kyc-review-label">Experience</span>
          <span className="kyc-review-value">{businessData.yearsExperience} years</span>
        </div>
        {/* <div className="kyc-review-item">
          <span className="kyc-review-label">Government ID</span>
          <span className="kyc-review-value kyc-review-file">
            <IoCheckmarkCircle className="kyc-review-check" /> {documents.idDocument?.name}
          </span>
        </div> */}
        <div className="kyc-review-item">
          <span className="kyc-review-label">Business proof</span>
          <span className="kyc-review-value kyc-review-file">
            <IoCheckmarkCircle className="kyc-review-check" /> {documents.businessProof?.name}
          </span>
        </div>
      </div>

      <div className="kyc-didit-info">
        <div className="kyc-didit-badge">Powered by Didit</div>
        <p className="kyc-didit-text">
          Clicking <strong>"Verify my identity"</strong> will take you to our secure identity
          verification partner. You'll complete a quick liveness check and ID scan. This takes
          under 2 minutes.
        </p>
        <ul className="kyc-didit-checklist">
          <li><IoCheckmarkCircle /> AI-powered ID verification</li>
          <li><IoCheckmarkCircle /> Passive liveness detection</li>
          <li><IoCheckmarkCircle /> Your data is encrypted end-to-end</li>
        </ul>
      </div>
    </div>
  )
}

export default KycFlow