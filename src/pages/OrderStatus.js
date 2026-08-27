import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { MdContentCopy, MdOutlineBedroomParent, MdOutlineAccountBalance } from 'react-icons/md'
import { GrLocation } from 'react-icons/gr'
import { LuBuilding2 } from 'react-icons/lu'
import { FiCheckCircle, FiCircle } from 'react-icons/fi'
import { Loader } from '../exports'
import { useAuth } from '../context/AuthProvider'
import { API_BASE } from '../config/api'
import './OrderPreview.css'
import './OrderStatus.css'

const PAYMENT_WINDOW_HOURS = 72

const formatCurrency = (amount, currency = 'NGN') => {
  const value = Number(amount)
  if (!Number.isFinite(value)) return `0 ${currency}`
  return `₦${value.toLocaleString('en-NG')}`
}

const formatDateTime = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return `${date.toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: '2-digit' })} · ${date.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}`
}

const normalizeStatus = (value = '') => String(value).trim().toLowerCase()

const getStatusMeta = (status, paymentStatus) => {
  const normalized = normalizeStatus(status)
  const paymentNormalized = normalizeStatus(paymentStatus)

  if (paymentNormalized === 'pending_proof') {
    return {
      label: 'Payment Pending',
      tone: 'payment',
      description: 'Payment proof has not been confirmed yet.',
      step: 1,
    }
  }

  if (normalized === 'pending_proof') {
    return {
      label: 'Payment Pending',
      tone: 'payment',
      description: 'Payment proof has not been confirmed yet.',
      step: 1,
    }
  }

  // Legacy compatibility only: older orders may still surface these states.
  if (normalized === 'accepted' || normalized === 'approved') {
    return {
      label: 'Approved',
      tone: 'approved',
      description: 'The order has been approved and is in progress.',
      step: 1,
    }
  }

  if (normalized === 'completed') {
    return {
      label: 'Completed',
      tone: 'completed',
      description: 'The order has been completed successfully.',
      step: 2,
    }
  }

  if (normalized === "expired") {
    return {
      label: "Expired",
      tone: "expired",
      description: "This order expired because the reservation window elapsed.",
      step: 0,
    }
  }

  if (normalized === 'cancelled') {
    return {
      label: 'Cancelled',
      tone: 'cancelled',
      description: 'The order was cancelled before completion.',
      step: 0,
    }
  }

  // Legacy compatibility only: older orders may still surface rejected.
  if (normalized === 'rejected') {
    return {
      label: 'Rejected',
      tone: 'rejected',
      description: 'The order was rejected and is no longer active.',
      step: 0,
    }
  }

  return {
    label: normalized ? normalized.charAt(0).toUpperCase() + normalized.slice(1) : 'Pending',
    tone: 'pending',
    description: 'The order is waiting for the buyer to mark payment proof.',
    step: 0,
  }
}

const resolveMedia = (media = []) =>
  (Array.isArray(media) ? media : [])
    .map((item) => (typeof item === 'string' ? item : item?.url))
    .filter(Boolean)

const normalizeOrder = (order) => {
  if (!order) return null

  const property = order.property || {}
  const createdAt = order.createdAt || null
  const expiresAt = order.expiresAt || null
  const commission = Number(property.commission ?? order.commission ?? 0) || 0
  const amount = Number(order.amount ?? property.amount ?? 0) || 0

  return {
    raw: order,
    orderId: order._id || order.id || '',
    orderNumber: order.orderNumber || (order._id ? `ORD-${String(order._id).slice(-6).toUpperCase()}` : 'ORD-UNKNOWN'),
    status: order.status || '',
    paymentStatus: order.paymentStatus || '',
    createdAt,
    updatedAt: order.updatedAt || order.updated_at || createdAt,
    expiresAt,
    amount,
    commission,
    totalPayment: amount + commission,
    currency: order.currency || 'NGN',
    propertyId: property._id || order.propertyId || '',
    propertyStatus: property.status || '',
    propertyTitle: property.title || 'Listing unavailable',
    propertyDescription: property.description || '',
    propertyImages: resolveMedia(property.media),
    propertyLocation: [property.location?.town, property.location?.state].filter(Boolean).join(', '),
    propertyType: property.property_type ? property.property_type.charAt(0).toUpperCase() + property.property_type.slice(1) : '',
    listingType: property.listing_type || '',
    bedrooms: property.bedrooms || '',
    ownerId: property.owner?._id || order.seller?._id || '',
    ownerName: property.owner?.fullName || property.owner?.username || order.seller?.fullName || order.seller?.username || 'Unknown agent',
    ownerAvatar: property.owner?.avatar || order.seller?.avatar || '',
    buyerName: order.buyer?.fullName || order.buyer?.username || 'You',
    buyerId: order.buyer?._id || '',
    sellerPayoutDetails: order.seller?.payoutDetails || null,
  }
}

const getCurrentUserId = (user) => {
  if (user?.id || user?._id) {
    return String(user.id || user._id)
  }

  try {
    const token = localStorage.getItem('token')
    if (!token) return ''
    return String(JSON.parse(atob(token.split('.')[1]))?.id || '')
  } catch {
    return ''
  }
}
// =====================================
//  Main Component
// =====================================
const OrderStatus = () => {
  const [now, setNow] = useState(() => Date.now())
  const hasTriggeredExpiryRefetch = useRef(false)
  const { orderId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const [orderData, setOrderData] = useState(() => normalizeOrder(location.state?.rawOrder || location.state?.order || null))
  const [isLoading, setIsLoading] = useState(!location.state?.rawOrder && !location.state?.order)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [actionError, setActionError] = useState('')
  const [actionSuccess, setActionSuccess] = useState('')
  const [isActionBusy, setIsActionBusy] = useState(false)

  // Ticking clock, re-renders every second so the countdown updates live.
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  const fetchOrder = useCallback(async (signal) => {
    setIsLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Missing authentication token')

      const res = await axios.get(`${API_BASE}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      })

      if (signal?.aborted) return

      const match = (res.data.items || []).find((item) => String(item._id) === String(orderId))
      if (!match) throw new Error('Order not found')

      setOrderData(normalizeOrder(match))
    } catch (err) {
      if (signal?.aborted) return

      setError(err?.response?.data?.message || err.message || 'Failed to load order status')
      setOrderData(null)
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false)
      }
    }
  }, [orderId])

  useEffect(() => {
    const controller = new AbortController()

    const initialOrder = location.state?.rawOrder || location.state?.order || null
    const initialId = initialOrder?._id || initialOrder?.id || location.state?.order?.orderId || location.state?.orderId || ''

    if (initialOrder && String(initialId) === String(orderId)) {
      setOrderData(normalizeOrder(initialOrder))
      setIsLoading(false)
      setError('')
    } else {
      fetchOrder(controller.signal)
    }

    return () => controller.abort()
  }, [location.state, orderId, fetchOrder])

  const statusMeta = getStatusMeta(orderData?.status, orderData?.paymentStatus)
  const isWindowRelevant = ['pending', 'accepted', 'approved', 'pending_proof'].includes(normalizeStatus(orderData?.status)) || normalizeStatus(orderData?.paymentStatus) === 'pending_proof'
  const expiresAt = orderData?.expiresAt
    ? new Date(orderData.expiresAt)
    : orderData?.createdAt
      ? new Date(new Date(orderData.createdAt).getTime() + PAYMENT_WINDOW_HOURS * 60 * 60 * 1000)
      : null
  const secondsLeft = expiresAt ? Math.max(0, Math.floor((expiresAt.getTime() - now) / 1000)) : 0
  const hoursLeft = Math.floor(secondsLeft / 3600)
  const minutesLeft = Math.floor((secondsLeft % 3600) / 60)
  const secondsRemain = secondsLeft % 60
  const isExpired = isWindowRelevant && secondsLeft === 0

  useEffect(() => {
    const controller = new AbortController()

    if (isExpired && !hasTriggeredExpiryRefetch.current) {
      hasTriggeredExpiryRefetch.current = true
      fetchOrder(controller.signal)
    }

    if (!isExpired) {
      hasTriggeredExpiryRefetch.current = false
    }

    return () => controller.abort()
  }, [isExpired, fetchOrder])

  const pad = (value) => String(Math.floor(value)).padStart(2, '0')
  const currentUserId = getCurrentUserId(user)
  const isBuyer = !!orderData?.buyerId && String(orderData.buyerId) === String(currentUserId)
  const isSeller = !!orderData?.ownerId && String(orderData.ownerId) === String(currentUserId)
  const isTerminalOrder = ['completed', 'cancelled', 'rejected', 'expired'].includes(normalizeStatus(orderData?.status))
  const canBuyerPay = isBuyer && !isTerminalOrder && normalizeStatus(orderData?.paymentStatus) !== 'paid'
  const canBuyerCancel = isBuyer && !isTerminalOrder
  const canSellerCancel = isSeller && !isTerminalOrder && normalizeStatus(orderData?.propertyStatus) !== 'reserved'
  const canSellerConfirmPayment = isSeller && normalizeStatus(orderData?.paymentStatus) === 'pending_proof' && normalizeStatus(orderData?.status) !== 'completed'
  const isCompletedOrder = normalizeStatus(orderData?.status) === 'completed'
  const isExpiredOrder = normalizeStatus(orderData?.status) === "expired"
  const isCancelledOrder = ['cancelled', 'rejected'].includes(normalizeStatus(orderData?.status))
  
  const sellerPayoutDetails = orderData?.sellerPayoutDetails || null
  const isBuyerAndHasPaymentDetails = isBuyer && sellerPayoutDetails

  const handleCopyOrderNo = () => {
    const value = orderData?.orderNumber || orderData?.orderId
    if (!value || !navigator.clipboard?.writeText) return
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  const handleOpenPreview = () => {
    if (!orderData?.propertyId) return
    navigate(`/listing/${orderData.propertyId}/order`)
  }

  const updateOrder = async (payload, successMessage) => {
    if (!orderData?.orderId || isActionBusy) return

    const token = localStorage.getItem('token')
    if (!token) return

    setIsActionBusy(true)
    setActionError('')
    setActionSuccess('')

    try {
      const res = await axios.patch(
        `${API_BASE}/orders/${orderData.orderId}/status`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const updated = normalizeOrder(res.data?.order || null)
      if (updated) {
        setOrderData(updated)
      }
      setActionSuccess(successMessage)
    } catch (err) {
      setActionError(err?.response?.data?.message || err.message || 'Failed to update order')
    } finally {
      setIsActionBusy(false)
    }
  }

  const handleBuyerPayNow = () => {
    updateOrder({ paymentStatus: 'pending_proof' }, 'Payment marked as pending confirmation.')
  }

  const handleBuyerCancel = () => {
    updateOrder({ status: 'cancelled' }, 'Order cancelled.')
  }

  const handleSellerConfirmPayment = () => {
    // Seller confirms only after the buyer has marked the payment as proof-pending.
    updateOrder({ paymentStatus: 'paid', status: 'completed' }, 'Payment confirmed and order completed.')
  }
  const onPaymentDetailsClick = () => {
    navigate("/account/payment-details")
  }

  const handleSellerCancel = () => {
    // Old approval/reject flow retired:
    // - seller no longer approves or rejects the order
    // - seller only cancels when the property is no longer available
    updateOrder({ status: 'cancelled' }, 'Order cancelled.')
  }

  if (isLoading) {
    return (
      <div className="order-status-page">
        <div className="order-status-state">
          <Loader />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="order-status-page">
        <div className="order-status-state">
          <div className="submit-error">{error}</div>
        </div>
      </div>
    )
  }

  if (!orderData) {
    return (
      <div className="order-status-page">
        <div className="order-status-state">
          <div className="submit-error">Order not available.</div>
        </div>
      </div>
    )
  }

  const timelineSteps = [
    {
      key: 'placed',
      label: 'Placed',
      detail: 'The order was created and the listing was reserved.',
      icon: <FiCircle aria-hidden="true" />,
    },
    {
      key: 'payment',
      label: 'Payment',
      detail: 'The buyer has marked payment and it is awaiting payment confirmation.',
      icon: <FiCircle aria-hidden="true" />,
    },
    {
      key: 'completed',
      label: 'Completed',
      detail: 'The order is fully closed and completed.',
      icon: <FiCheckCircle aria-hidden="true" />,
    },
  ]

  return (
    <div className="order-status-page">
      <div className="op-card os-hero">
        <div className="os-hero-copy">
          <p className="os-kicker">Order Status</p>
          <h3 className="os-title">{orderData.orderNumber}</h3>
          <p className="os-subtitle">
            {formatDateTime(orderData.createdAt)}
            {' '}
            ·
            {' '}
            {statusMeta.description}
          </p>
        </div>
        <span className={`os-status-badge os-status-badge--${statusMeta.tone}`}>
          {statusMeta.label}
        </span>
      </div>

      {isCompletedOrder && (
        <div className="submit-success">
          This order has been completed successfully. The details below are read-only.
        </div>
      )}
      {isCancelledOrder && (
        <div className="submit-error">
          This order is no longer active. The details below are read-only.
        </div>
      )}
      {isExpiredOrder && (
        <div className="submit-error">
          This order expired when the reservation window elapsed.
        </div>
      )}
      {actionSuccess && <div className="submit-success">{actionSuccess}</div>}
      {actionError && <div className="submit-error">{actionError}</div>}

      {isWindowRelevant && (
        <div className="op-card op-card-timer os-window-card">
          <div className="op-timer-top">
            <span className="op-timer-label">
              {isExpired ? 'Reservation Window Closed' : 'Reservation Window Remaining'}
            </span>
            {!isExpired ? (
              <div className="op-timer-blocks" aria-live="polite">
                <span className="op-timer-block">{pad(hoursLeft)}</span>
                <span className="op-timer-sep">:</span>
                <span className="op-timer-block">{pad(minutesLeft)}</span>
                <span className="op-timer-sep">:</span>
                <span className="op-timer-block">{pad(secondsRemain)}</span>
              </div>
            ) : (
              <span className="op-timer-expired-badge">Expired</span>
            )}
          </div>
          <ul className="op-timer-notes">
            <li>Orders remain reserved for {PAYMENT_WINDOW_HOURS} hours</li>
            <li>Inspect the property before making payment.</li>
            <li>Meeting with the property management in open locations and verifying ownership is advised.</li>
          </ul>
        </div>
      )}

      <div className="op-card">
        {orderData.propertyImages?.[0] ? (
          <img
            src={orderData.propertyImages[0]}
            alt={orderData.propertyTitle}
            className="op-snapshot-image"
          />
        ) : (
          <div className="op-snapshot-placeholder" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}

        <div className="op-snapshot-body">
          <h3 className="op-snapshot-title">{orderData.propertyTitle}</h3>
          <div className="request-chips">
            {orderData.bedrooms && (
              <span className="request-chip request-chip--category">
                <MdOutlineBedroomParent aria-hidden="true" />
                {orderData.bedrooms}
              </span>
            )}
            {orderData.propertyType && (
              <span className="request-chip request-chip--category">
                <LuBuilding2 aria-hidden="true" />
                {orderData.propertyType}
              </span>
            )}
            {orderData.listingType && (
              <span className="request-chip request-chip--category">
                {orderData.listingType.charAt(0).toUpperCase() + orderData.listingType.slice(1)}
              </span>
            )}
            {orderData.propertyLocation && (
              <span className="request-chip request-chip--category">
                <GrLocation aria-hidden="true" />
                {orderData.propertyLocation}
              </span>
            )}
          </div>
          {orderData.propertyDescription && (
            <p className="op-snapshot-desc">{orderData.propertyDescription}</p>
          )}
        </div>
      </div>

      <div className="op-card">
        <div className="op-breakdown-row">
          <span className="op-breakdown-label">Amount</span>
          <span className="op-breakdown-value">{formatCurrency(orderData.amount, orderData.currency)}</span>
        </div>
        <div className="op-breakdown-row">
          <span className="op-breakdown-label">Commission</span>
          <span className="op-breakdown-value">{formatCurrency(orderData.commission, orderData.currency)}</span>
        </div>
        <div className="op-breakdown-row op-breakdown-row-total">
          <span className="op-breakdown-label">Total Payment</span>
          <span className="op-breakdown-value op-breakdown-value-total">
            {formatCurrency(orderData.totalPayment, orderData.currency)}
          </span>
        </div>
      </div>

      <div className="op-card">
        <div className="op-meta-row">
          <span className="op-meta-label">Order Number</span>
          <span className="op-meta-value">
            {orderData.orderNumber}
            <button
              className={`op-copy-btn ${copied ? 'op-copy-btn-copied' : ''}`}
              onClick={handleCopyOrderNo}
              aria-label="Copy order number"
              title={copied ? 'Copied!' : 'Copy order number'}
            >
              <MdContentCopy aria-hidden="true" />
            </button>
          </span>
        </div>
        <div className="op-meta-row">
          <span className="op-meta-label">Placed By</span>
          <span className="op-meta-value">{orderData.buyerName}</span>
        </div>
        <div className="op-meta-row">
          <span className="op-meta-label">Agent</span>
          <span className="op-meta-value">{orderData.ownerName}</span>
        </div>
        <div className="op-meta-row">
          <span className="op-meta-label">Status</span>
          <span className="op-meta-value">{statusMeta.label}</span>
        </div>
        <div className="op-meta-row">
          <span className="op-meta-label">Payment Status</span>
          <span className="op-meta-value">
            {orderData.paymentStatus
              ? orderData.paymentStatus === 'pending_proof'
                ? 'Payment Pending'
                : orderData.paymentStatus.charAt(0).toUpperCase() + orderData.paymentStatus.slice(1)
              : '—'}
          </span>
        </div>
        <div className="op-meta-row">
          <span className="op-meta-label">Created</span>
          <span className="op-meta-value">{formatDateTime(orderData.createdAt)}</span>
        </div>
        <div className="op-meta-row">
          <span className="op-meta-label">Updated</span>
          <span className="op-meta-value">{formatDateTime(orderData.updatedAt)}</span>
        </div>
      </div>

      <div className="op-card os-timeline-card">
        <div className="os-timeline-header">
          <span className="os-section-label">Progress</span>
          <span className="os-section-note">
            {statusMeta.description}
          </span>
        </div>

        <div className="os-timeline">
          {timelineSteps.map((step, index) => {
            const isComplete = statusMeta.step > index
            const isActive = statusMeta.step === index
            const isBlocked = statusMeta.step < index

            // Active step shows the live status (e.g. "Payment Pending", "Cancelled")
            // instead of the generic placeholder label.
            const displayLabel = isActive ? statusMeta.label : step.label
            const displayDetail = isActive ? statusMeta.description : step.detail

            return (
              <div
                key={step.key}
                className={`os-timeline-step ${isComplete ? 'os-timeline-step--complete' : ''} ${isActive ? 'os-timeline-step--active' : ''} ${isBlocked ? 'os-timeline-step--blocked' : ''}`}
              >
                <div className="os-step-marker">
                  {isComplete ? <FiCheckCircle aria-hidden="true" /> : step.icon}
                </div>
                <div className="os-step-copy">
                  <h4 className="os-step-label">{displayLabel}</h4>
                  <p className="os-step-desc">{displayDetail}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      {(isSeller && (!user?.payoutDetails?.bankName || user?.payoutDetails?.bankName === "")) && 
        <div className="cl-gate cl-gate--payout">
          <div className="cl-gate__icon-wrap">
            <MdOutlineAccountBalance className="cl-gate__icon" />
          </div>

          <div className="cl-gate__body">
            <p className="cl-gate__title">Payment Details Needed</p>
            <p className="cl-gate__sub">
              Your payout details are incomplete. Add them to be able to receive payment.
            </p>
          </div>

          <button
            className="cl-gate__cta"
            onClick={onPaymentDetailsClick}
          >
            Update Payment Details
          </button>
        </div>
      }
      {isBuyerAndHasPaymentDetails && (
      <div className="op-card">
        <div className="op-meta-row">
          <span className="op-meta-label">Payment Details</span>
          <span className="op-meta-value">Verify with the agent before proceeding</span>
        </div>

        <div className="op-meta-row">
          <span className="op-meta-label">Bank Name</span>
          <span className="op-meta-value">
            {sellerPayoutDetails.bankName || '—'}
          </span>
        </div>

        <div className="op-meta-row">
          <span className="op-meta-label">Account Name</span>
          <span className="op-meta-value">
            {sellerPayoutDetails.accountName || '—'}
          </span>
        </div>

        <div className="op-meta-row">
          <span className="op-meta-label">Account Number</span>
          <span className="op-meta-value">
            {sellerPayoutDetails.accountNumber || '—'}
          </span>
        </div>

        {sellerPayoutDetails.bankCode && (
          <div className="op-meta-row">
            <span className="op-meta-label">Bank Code</span>
            <span className="op-meta-value">
              {sellerPayoutDetails.bankCode}
            </span>
          </div>
        )}

        <div className="op-meta-row">
          <span className="op-meta-label">Payout Method</span>
          <span className="op-meta-value">
            {sellerPayoutDetails.payoutMethod || '—'}
          </span>
        </div>
      </div>
    )}

      {!isTerminalOrder && (
        <div className="op-card">
          {isBuyer && (
          <div className="op-actions os-actions">
            <button className="op-btn op-btn-cancel" onClick={handleBuyerCancel} disabled={!canBuyerCancel || isActionBusy}>
              Cancel Order
            </button>
            <button className="op-btn op-btn-pay" onClick={handleBuyerPayNow} disabled={!canBuyerPay || isActionBusy}>
              Mark as Paid
            </button>
          </div>
          )}

          {isSeller && (
          <div className="op-actions os-actions">
            <button className="op-btn op-btn-cancel" onClick={handleSellerCancel} disabled={!canSellerCancel || isActionBusy}>
              Cancel Order
            </button>
            {/* Old seller approval action retired:
                the seller no longer approves/rejects the order, they only
                cancel for unavailability or confirm payment after proof. */}
            <button className="op-btn op-btn-pay" onClick={handleSellerConfirmPayment} disabled={!canSellerConfirmPayment || isActionBusy}>
              Confirm Payment
            </button>
          </div>
          )}
          {isSeller && !canSellerCancel && (
            <p className="op-window-note">
              Cancel is only available when the property is no longer reserved for this order.
            </p>
          )}

          <div className="op-actions os-actions">
            <button className="op-btn op-btn-cancel" onClick={handleOpenPreview} disabled={!orderData.propertyId}>
              Review Listing
            </button>
          </div>
        </div>
      )}

      {isTerminalOrder && (
        <div className="op-card">
          <div className="op-actions os-actions">
            <button className="op-btn op-btn-cancel" onClick={handleOpenPreview} disabled={!orderData.propertyId}>
              Review Listing
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderStatus
