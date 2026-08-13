// ========================================
// Settings/SubscriptionSettings.js
// ========================================
import React, { useEffect, useState} from 'react'
import { ClickButton } from '../exports'
import { FiCheck } from 'react-icons/fi'
import { useAuth } from '../context/AuthProvider'
import axios from 'axios'
import { API_BASE } from '../config/api'

const plans = [
    {
      name: 'Free',
      price: '₦0',
      period: 'forever',
      features: [
        'Browse all listings',
        'Post property requests',
        'Follow agents',
        'Basic messaging'
      ]
    },
    {
      name: 'Pro',
      price: '₦2,000',
      period: 'per month',
      features: [
        'All Free features',
        'Unlimited messaging',
        'Priority support',
        'Advanced search filters',
        'Save searches'
      ],
      popular: true
    },
    {
      name: 'Premium',
      price: '₦5,000',
      period: 'per month',
      features: [
        'All Pro features',
        'Verified agent badge',
        'Unlimited property listings',
        'Boost 10 listings/month',
        'Priority in search results',
        'Advanced analytics'
      ]
    }
  ]

// Main Component
const SubscriptionSettings = () => {

  const { user, refetchUser } = useAuth()
  const currentPlan = user.plan.charAt(0).toUpperCase() + user.plan.slice(1) // Free, Pro, Premium

  const [error, setError] = useState('')
  const [confirmStatus, setConfirmStatus] = useState(null) // null | 'confirming' | 'success' | 'timeout' | 'cancelled'

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const status = params.get('status')

    if (status === 'cancelled') {
      setConfirmStatus('cancelled')
      return
    }
    if (status !== 'success') return

    setConfirmStatus('confirming')
    let attempts = 0
    const interval = setInterval(async () => {
        attempts += 1
        const updatedPlan = await refetchUser()

        if (updatedPlan && updatedPlan !== 'free') {
            clearInterval(interval)
            setConfirmStatus('success')
        } else if (attempts >= 8) {
            clearInterval(interval)
            setConfirmStatus('timeout')
        }
    }, 2500)

    return () => clearInterval(interval)
  }, [refetchUser])

  const handleUpgrade = async (planName) => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.post(
        `${API_BASE}/billing/checkout-session`,
        { plan: planName.toLowerCase() },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      window.location.href = res.data.checkoutUrl
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to start upgrade')
    }
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2>Subscription</h2>
        <p className="settings-subtitle">Manage your plan and billing</p>
      </div>
      {confirmStatus === 'confirming' && (
        <div className="submit-success">Confirming your upgrade — this can take a few seconds...</div>
      )}
      {confirmStatus === 'success' && (
        <div className="submit-success">Your upgrade is confirmed. Welcome to {currentPlan}!</div>
      )}
      {confirmStatus === 'timeout' && (
        <div className="submit-error">
          Payment may still be processing. If your plan doesn't update in a few minutes, contact support with your order details.
        </div>
      )}
      {confirmStatus === 'cancelled' && (
        <div className="submit-error">Checkout was cancelled, you haven't been charged.</div>
      )}
      {error && <div className="submit-error">{error}</div>}

      <div className="current-plan-banner">
        <div>
          <h3>Current Plan: {currentPlan}</h3>
          <p>You are on the {currentPlan} plan</p>
        </div>
      </div>

      <div className="plans-grid">
        {plans.map((plan) => (
          <div key={plan.name} className={`plan-card ${plan.popular ? 'popular' : ''} ${currentPlan === plan.name ? 'current' : ''}`}>
            {plan.popular && <div className="popular-badge">Most Popular</div>}
            <h3 className="plan-name">{plan.name}</h3>
            <div className="plan-price">
              <span className="price">{plan.price}</span>
              <span className="period">/{plan.period}</span>
            </div>
            <ul className="plan-features">
              {plan.features.map((feature, idx) => (
                <li key={idx}>
                  <FiCheck className="check-icon" />
                  {feature}
                </li>
              ))}
            </ul>
            {currentPlan !== plan.name && (
              <ClickButton
                text={`Upgrade to ${plan.name}`}
                onClick={() => handleUpgrade(plan.name)}
                variant={plan.popular ? 'primary' : 'outline'}
                size="large"
                disabled={confirmStatus === 'confirming'}
              />
            )}
            {currentPlan === plan.name && (
              <div className="current-plan-badge">Current Plan</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default SubscriptionSettings
