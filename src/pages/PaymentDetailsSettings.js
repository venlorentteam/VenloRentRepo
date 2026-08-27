import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ClickButton } from '../exports'
import { useAuth } from '../context/AuthProvider'
import { FiCreditCard, FiSave } from 'react-icons/fi'
import { API_BASE } from '../config/api'
import '../components/SettingsDetails.css'

const PAYMENT_METHODS = [
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'wallet', label: 'Wallet' },
  { value: 'other', label: 'Other' },
]

const PaymentDetailsSettings = () => {
  const { user, updateUser } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitSuccess, setSubmitSuccess] = useState('')
  const [formData, setFormData] = useState({
    bankName: '',
    accountName: '',
    accountNumber: '',
    bankCode: '',
    payoutMethod: 'bank_transfer',
  })

  useEffect(() => {
    const payoutDetails = user?.payoutDetails || {}
    setFormData({
      bankName: payoutDetails.bankName || '',
      accountName: payoutDetails.accountName || '',
      accountNumber: payoutDetails.accountNumber || '',
      bankCode: payoutDetails.bankCode || '',
      payoutMethod: payoutDetails.payoutMethod || 'bank_transfer',
    })
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.bankName.trim()) newErrors.bankName = 'Bank name is required'
    if (!formData.accountName.trim()) newErrors.accountName = 'Account name is required'
    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required'
    } else if (!/^\d{8,14}$/.test(formData.accountNumber.trim())) {
      newErrors.accountNumber = 'Account number must be 8 to 14 digits'
    }
    if (!formData.payoutMethod.trim()) newErrors.payoutMethod = 'Payout method is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (user?.role !== 'agent') return
    if (!validate()) return

    setIsSaving(true)
    setSubmitSuccess('')

    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const res = await axios.patch(
        `${API_BASE}/payment-details`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (res.data?.success && res.data?.user) {
        updateUser(res.data.user)
      }
      setSubmitSuccess(res.data?.message || 'Payment details updated successfully')
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        submit: err.response?.data?.message || err.message || 'Failed to update payment details',
      }))
    } finally {
      setIsSaving(false)
    }
  }
  // const payoutDetails = user?.payoutDetails || {}
  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2>Payment Details</h2>
        <p className="settings-subtitle">Manage the bank details used for order payouts</p>
      </div>

      <div className="settings-section">
        <div className="privacy-item" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <div className="privacy-info">
            <FiCreditCard className="privacy-icon" />
            <div>
              <h4>Seller payout profile</h4>
              <p>These details are used when buyers complete payment and the order is finalized.</p>
            </div>
          </div>
        </div>

        {submitSuccess && <div className="submit-success">{submitSuccess}</div>}
        {errors.submit && <div className="submit-error">{errors.submit}</div>}

        <div className="form-group">
          <label className="form-label">Bank Name</label>
          <input
            className={`profile-input ${errors.bankName ? 'input-error' : ''}`}
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            placeholder="Enter bank name"
          />
          {errors.bankName && <span className="error-message">{errors.bankName}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Account Name</label>
          <input
            className={`profile-input ${errors.accountName ? 'input-error' : ''}`}
            name="accountName"
            value={formData.accountName}
            onChange={handleChange}
            placeholder="Enter account name"
          />
          {errors.accountName && <span className="error-message">{errors.accountName}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Account Number</label>
          <input
            className={`profile-input ${errors.accountNumber ? 'input-error' : ''}`}
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            inputMode="numeric"
            placeholder="Enter account number"
            maxLength="14"
          />
          {errors.accountNumber && <span className="error-message">{errors.accountNumber}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Bank Code</label>
          <input
            className="profile-input"
            name="bankCode"
            value={formData.bankCode}
            onChange={handleChange}
            placeholder="Optional bank code"
          />
          <span className="input-hint">Optional, but helpful for bank transfer integrations.</span>
        </div>

        <div className="form-group">
          <label className="form-label">Payout Method</label>
          <select
            className={`profile-input ${errors.payoutMethod ? 'input-error' : ''}`}
            name="payoutMethod"
            value={formData.payoutMethod}
            onChange={handleChange}
          >
            {PAYMENT_METHODS.map((method) => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </select>
          {errors.payoutMethod && <span className="error-message">{errors.payoutMethod}</span>}
        </div>

        <div className="settings-actions">
          <ClickButton
            text={isSaving ? 'Saving...' : 'Save Payment Details'}
            onClick={handleSave}
            disabled={isSaving}
            isLoading={isSaving}
            variant="primary"
            size="large"
            icon={<FiSave />}
          />
        </div>
      </div>
    </div>
  )
}

export default PaymentDetailsSettings
