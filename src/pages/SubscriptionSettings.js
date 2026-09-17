// ========================================
// Settings/SubscriptionSettings.js
// ========================================
import React, { useEffect, useState } from 'react'
import { ClickButton } from '../exports'
import { FiCheck } from 'react-icons/fi'
import { useAuth } from '../context/AuthProvider'
import axios from 'axios'
import { API_BASE } from '../config/api'

// Static: things Bachs has no concept of. No price/name here anymore —
// those come from the API. This is the single source of truth for copy/features.
const planMeta = {
  free: {
    name: 'Free',
    features: ['Browse all listings', 'Post property requests', 'Follow agents', 'Basic messaging'],
  },
  pro: {
    name: 'Pro',
    features: ['All Free features', 'Unlimited messaging', 'Priority support', 'Advanced search filters', 'Save searches'],
    popular: true,
  },
  premium: {
    name: 'Premium',
    features: ['All Pro features', 'Verified agent badge', 'Unlimited property listings', 'Boost 10 listings/month', 'Priority in search results', 'Advanced analytics'],
  },
}

const formatPrice = (price, currency) => {
  if (!price) return '₦0'
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency, maximumFractionDigits: 0 }).format(price)
}

const SubscriptionSettings = () => {
  const { user, refetchUser } = useAuth()
  const currentPlan = user.plan.charAt(0).toUpperCase() + user.plan.slice(1)

  const [plans, setPlans] = useState(null)      // null = still loading
  const [plansError, setPlansError] = useState('')
  const [error, setError] = useState('')
  const [confirmStatus, setConfirmStatus] = useState(null)

  // Fetch live pricing once on mount.
  useEffect(() => {
    let cancelled = false

    const loadPlans = async () => {
      try {
        const res = await axios.get(`${API_BASE}/billing/plans`)
        if (cancelled) return

        // Merge backend pricing with local copy/features, always in a fixed order.
        const merged = ['free', 'pro', 'premium'].map((key) => {
          const meta = planMeta[key]
          const live = res.data.plans[key]
          return {
            key,
            name: meta.name,
            popular: meta.popular || false,
            features: meta.features,
            price: key === 'free' ? '₦0' : formatPrice(live?.price, live?.currency),
            period: key === 'free' ? 'forever' : `per ${live?.interval || 'month'}`,
          }
        })
        setPlans(merged)
      } catch (err) {
        if (cancelled) return
        setPlansError('Could not load current pricing — showing your last known plan details.')
        // Fallback so the page still renders something instead of breaking entirely.
        setPlans(['free', 'pro', 'premium'].map((key) => ({
          key,
          name: planMeta[key].name,
          popular: planMeta[key].popular || false,
          features: planMeta[key].features,
          price: key === 'free' ? '₦0' : '—',
          period: key === 'free' ? 'forever' : 'per month',
        })))
      }
    }

    loadPlans()
    return () => { cancelled = true }
  }, [])

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

  const handleUpgrade = async (planKey) => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.post(
        `${API_BASE}/billing/checkout-session`,
        { plan: planKey },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      window.location.href = res.data.checkoutUrl
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to start upgrade')
    }
  }

  if (!plans) {
    return <div className="settings-page">Loading plans…</div>
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2>Subscription</h2>
        <p className="settings-subtitle">Manage your plan and billing</p>
      </div>

      {confirmStatus === 'confirming' && <div className="submit-success">Confirming your upgrade — this can take a few seconds...</div>}
      {confirmStatus === 'success' && <div className="submit-success">Your upgrade is confirmed. Welcome to {currentPlan}!</div>}
      {confirmStatus === 'timeout' && <div className="submit-error">Payment may still be processing. If your plan doesn't update in a few minutes, contact support with your order details.</div>}
      {confirmStatus === 'cancelled' && <div className="submit-error">Checkout was cancelled, you haven't been charged.</div>}
      {plansError && <div className="submit-error">{plansError}</div>}
      {error && <div className="submit-error">{error}</div>}

      <div className="current-plan-banner">
        <div>
          <h3>Current Plan: {currentPlan}</h3>
          <p>You are on the {currentPlan} plan</p>
        </div>
      </div>

      <div className="plans-grid">
        {plans.map((plan) => (
          <div key={plan.key} className={`plan-card ${plan.popular ? 'popular' : ''} ${currentPlan === plan.name ? 'current' : ''}`}>
            {plan.popular && <div className="popular-badge">Most Popular</div>}
            <h3 className="plan-name">{plan.name}</h3>
            <div className="plan-price">
              <span className="price">{plan.price}</span>
              <span className="period">/{plan.period}</span>
            </div>
            <ul className="plan-features">
              {plan.features.map((feature, idx) => (
                <li key={idx}><FiCheck className="check-icon" />{feature}</li>
              ))}
            </ul>
            {currentPlan !== plan.name && (
              <ClickButton
                text={`Upgrade to ${plan.name}`}
                onClick={() => handleUpgrade(plan.key)}
                variant={plan.popular ? 'primary' : 'outline'}
                size="large"
                disabled={confirmStatus === 'confirming'}
              />
            )}
            {currentPlan === plan.name && <div className="current-plan-badge">Current Plan</div>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default SubscriptionSettings