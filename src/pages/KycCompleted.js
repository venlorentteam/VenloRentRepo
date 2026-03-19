import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { BsBuildingCheck } from 'react-icons/bs'
import { IoCheckmarkCircle, IoCloseCircle, IoTimeOutline, IoReloadOutline } from 'react-icons/io5'
import { RiArrowRightLine, RiCustomerService2Line } from 'react-icons/ri'
import { MdOutlineVerified } from 'react-icons/md'
import { PrelimFooter } from '../exports'
import './KycCompleted.css'

// Maps Didit's status query param to our UI state config
const statusConfig = {
  Approved: {
    type: 'success',
    icon: IoCheckmarkCircle,
    iconClass: 'kyc-cb-icon--success',
    title: 'Identity Verified!',
    subtitle: 'Your agent profile is now active',
    message: 'You\'ve successfully completed identity verification. You can now create listings, receive messages from clients, and access all agent features on VenloRent.',
    badge: 'Verified Agent',
    badgeClass: 'kyc-cb-badge--success',
    primaryLabel: 'Go to Dashboard',
    primaryAction: '/dashboard',
    showSecondary: false,
  },
  Declined: {
    type: 'error',
    icon: IoCloseCircle,
    iconClass: 'kyc-cb-icon--error',
    title: 'Verification Failed',
    subtitle: 'We couldn\'t verify your identity',
    message: 'Your identity verification was unsuccessful. This can happen due to a blurry ID scan, poor lighting, or a mismatch between your selfie and document. Please try again.',
    badge: 'Verification Failed',
    badgeClass: 'kyc-cb-badge--error',
    primaryLabel: 'Try Again',
    primaryAction: '/kyc',
    showSecondary: true,
    secondaryLabel: 'Contact Support',
    secondaryAction: 'support',
  },
  // Covers: In Review, In Progress, Not Started, or unknown statuses
  default: {
    type: 'pending',
    icon: IoTimeOutline,
    iconClass: 'kyc-cb-icon--pending',
    title: 'Verification In Review',
    subtitle: 'We\'re reviewing your submission',
    message: 'Your verification is being processed. This usually takes a few minutes. We\'ll update your profile automatically once the review is complete — no action needed.',
    badge: 'Under Review',
    badgeClass: 'kyc-cb-badge--pending',
    primaryLabel: 'Go to Dashboard',
    primaryAction: '/dashboard',
    showSecondary: false,
  },
}

const KycCompleted = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [visible, setVisible] = useState(false)

  const rawStatus = searchParams.get('status') // e.g. "Approved", "Declined"
  const config = statusConfig[rawStatus] || statusConfig.default
  const Icon = config.icon

  // Trigger entrance animation after mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60)
    return () => clearTimeout(t)
  }, [])

  const handlePrimary = () => navigate(config.primaryAction)

  const handleSecondary = () => {
    if (config.secondaryAction === 'support') {
      window.location.href = 'mailto:support@venlorent.com'
    } else {
      navigate(config.secondaryAction)
    }
  }

  return (
    <>
      <div className="kyc-page">
          <div className={`kyc-cb-container ${visible ? 'kyc-cb-container--visible' : ''}`}>

              {/* ── Left Panel (reused from KycFlow) ── */}
              <div className="kyc-left">
              <div className="kyc-left-content">
                  <div className="kyc-brand">
                  <BsBuildingCheck className="kyc-brand-icon" />
                  <span className="kyc-brand-name">VenloRent</span>
                  </div>

                  <div className="kyc-left-text">
                  <h2 className="kyc-left-title">
                      {config.type === 'success'
                      ? 'Welcome You\'re a Verified \nVenloRent Agent'
                      : config.type === 'error'
                      ? 'Let\'s Sort\nThis Out'
                      : 'Almost\nThere'}
                  </h2>
                  <p className="kyc-left-subtitle">
                      {config.type === 'success'
                      ? 'Your verified badge builds trust with clients and unlocks your full agent dashboard.'
                      : config.type === 'error'
                      ? 'Verification issues happen. A quick retry with good lighting usually does the trick.'
                      : 'Manual reviews ensure the highest quality of verified agents on the platform.'}
                  </p>
                  </div>

                  {/* Status indicator on left panel */}
                  <div className={`kyc-cb-left-status kyc-cb-left-status--${config.type}`}>
                  <Icon className="kyc-cb-left-status-icon" />
                  <span>{config.badge}</span>
                  </div>

                  {/* What happens next bullets */}
                  <div className="kyc-cb-next-steps">
                  <p className="kyc-cb-next-label">What happens next</p>
                  <ul className="kyc-cb-next-list">
                    {config.type === 'success' && 
                      <>
                        <li><IoCheckmarkCircle /> Verified badge on your profile</li>
                        <li><IoCheckmarkCircle /> Create and manage listings</li>
                        <li><IoCheckmarkCircle /> Receive client messages</li>
                      </>
                    }
                    {config.type === 'error' && 
                      <>
                        <li><IoReloadOutline /> Retry with better lighting</li>
                        <li><IoCheckmarkCircle /> Ensure ID is not expired</li>
                        <li><RiCustomerService2Line /> Contact support if issue persists</li>
                      </>
                    }
                    {config.type === 'pending' && 
                      <>
                        <li><IoTimeOutline /> Review takes a few minutes</li>
                        <li><IoCheckmarkCircle /> Profile updates automatically</li>
                        <li><IoCheckmarkCircle /> You'll be notified when done</li>
                      </>
                    }
                  </ul>
                  </div>
              </div>
              </div>

              {/* ── Right Panel ── */}
              <div className="kyc-right">
                <div className="kyc-form-wrapper kyc-cb-right-wrapper">

                    {/* Animated icon */}
                  <div className={`kyc-cb-icon-wrap kyc-cb-icon-wrap--${config.type}`}>
                    <div className={`kyc-cb-icon-ring kyc-cb-icon-ring--${config.type}`} />
                    <Icon className={`kyc-cb-icon ${config.iconClass}`} />
                    </div>

                    {/* Badge */}
                    <div className={`kyc-cb-badge ${config.badgeClass}`}>
                    <MdOutlineVerified />
                    {config.badge}
                    </div>

                    {/* Heading */}
                    <div className="kyc-cb-heading">
                    <h2 className="kyc-cb-title">{config.title}</h2>
                    <p className="kyc-cb-subtitle">{config.subtitle}</p>
                    </div>

                    {/* Message card */}
                    <div className={`kyc-cb-message-card kyc-cb-message-card--${config.type}`}>
                    <p className="kyc-cb-message">{config.message}</p>
                    </div>

                    {/* Powered by Didit (reused style from KycFlow.css) */}
                    <div className="kyc-didit-info kyc-cb-didit-info">
                    <div className="kyc-didit-badge">Powered by Didit</div>
                      <p className="kyc-didit-text">
                          Identity verification is handled securely by Didit. Your data is encrypted end-to-end and never shared without your consent.
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="kyc-nav-buttons kyc-cb-actions">
                    {config.showSecondary && (
                        <button className="kyc-btn-back" onClick={handleSecondary}>
                        <RiCustomerService2Line /> {config.secondaryLabel}
                        </button>
                    )}
                    <button className="kyc-btn-submit" onClick={handlePrimary}>
                        {config.primaryLabel} <RiArrowRightLine />
                    </button>
                  </div>

                </div>
              </div>

          </div>
        </div>
        <PrelimFooter />
    </>
  )
}

export default KycCompleted