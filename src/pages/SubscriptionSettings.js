// ========================================
// Settings/SubscriptionSettings.js
// ========================================

import { ClickButton, UpgradeWidget } from '../exports'
import { FiCheck } from 'react-icons/fi'
import { useAuth } from '../context/AuthProvider'

const SubscriptionSettings = () => {
const { user } = useAuth()
  const currentPlan = user.plan.charAt(0).toUpperCase() + user.plan.slice(1) // Free, Pro, Premium

  const plans = [
    {
      name: 'Free',
      price: '0$',
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
      price: '$50',
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
      price: '$150',
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

  const handleUpgrade = (planName) => {
    alert(`Upgrade to ${planName} - Payment integration coming soon!`)
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2>Subscription</h2>
        <p className="settings-subtitle">Manage your plan and billing</p>
      </div>

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
