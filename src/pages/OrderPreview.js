import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Header, ClickButton, PageSetup } from '../exports'
import { GrLocation } from 'react-icons/gr'
import { MdOutlineBedroomParent, MdContentCopy } from 'react-icons/md'
import { LuBuilding2 } from 'react-icons/lu'
import { RiCustomerServiceLine } from 'react-icons/ri'
import './OrderPreview.css'
import { useAuth } from '../context/AuthProvider'
import axios from 'axios'

//  COUNTDOWN CONSTANTS
// The timer is initialised from the order's createdAt timestamp so it
// survives page refreshes correctly.
const PAYMENT_WINDOW_HOURS = 72
const OrderPreview = ({
  order = {
    id: '',
    orderNumber: '14809346781932',
    createdAt: new Date(Date.now() - 1000 * 60 * 17).toISOString(), // 17 min ago
    amount: 1_000_000,
    commission: 100_000,
    totalPayment: 1_100_000,
    status: 'pending',
  },
  listing = {
    title: 'Spacious 2-Bed Apartment — Gwagwalada',
    images: [],
    description: 'Self contained apartment, with steady water and light, 24/7 security and well-maintained common areas. Close to major road and market.',
    location: 'Gwagwalada, Abuja',
    category: 'Apartment',
    bedrooms: '2 Bed',
    listingType: 'rent',
    features: ['Generator', 'Borehole / Water', 'Parking', 'Security', 'Air Conditioning'],
  },
  onCancel = () => {},
  onPay = () => {}
}) => {
  const { propertyId } = useParams()
  const navigate = useNavigate()

  // == Countdown state ===============================
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [orderStarted, setOrderStarted] = useState(false)
  const [isPlacing, setIsPlacing] = useState(false)
  const [orderData, setOrderData] = useState(null)
  const [listingData, setListingData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!propertyId) {
      setIsLoading(false)
      setError("Missing property id")
      return
    }
    const fetchProperty = async () => {
      setIsLoading(true)
      setError("")
      try {
        const res = await axios.get(`https://newprojectbackend-5axx.onrender.com/properties/${propertyId}`)
        const p = res.data?.property
        if (!p) {
          setError("Property not found")
          setListingData(null)
          return
        }
        setListingData({
          id: p._id,
          ownerId: p.owner?._id || "",
          title: p.title,
          images: (p.media || []).map((m) => (typeof m === "string" ? m : m?.url)).filter(Boolean),
          description: p.description || "",
          location: [p.location?.town, p.location?.state].filter(Boolean).join(", "),
          category: p.property_type ? p.property_type.charAt(0).toUpperCase() + p.property_type.slice(1) : "",
          bedrooms: p.bedrooms || "",
          listingType: p.listing_type || "",
          features: (() => {
            const raw = p.features
            if (Array.isArray(raw)) return raw
            if (typeof raw === "string") {
              const trimmed = raw.trim()
              if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
                try {
                  const parsed = JSON.parse(trimmed)
                  return Array.isArray(parsed) ? parsed : [parsed]
                } catch {
                  // fall through to comma split
                }
              }
              return trimmed.split(",").map((s) => s.trim()).filter(Boolean)
            }
            return []
          })(),
          amount: Number(p.amount) || 0,
          commission: Number(p.commission) || 0,
        })
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load property")
        setListingData(null)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProperty()
  }, [propertyId])

  useEffect(() => {
    if (!orderStarted || !orderData?.createdAt) return
    const elapsed = (Date.now() - new Date(orderData.createdAt).getTime()) / 1000
    setSecondsLeft(Math.max(0, PAYMENT_WINDOW_HOURS * 3600 - elapsed))
    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) { clearInterval(interval); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [orderStarted, orderData?.createdAt])

  const { user } = useAuth() // Get the user object
  const handleContactAgent = () => {
    if (!listingData?.ownerId) return
    // Navigate to inbox; the agentId param tells Inbox to auto-open this thread.
    navigate(`/inbox?agentId=${listingData.ownerId}`) 
  }

  // Description expand/collapse 
  const [descExpanded, setDescExpanded] = useState(false)

  // Copy order number
  const [copied, setCopied] = useState(false)
  const copyOrderNumber = () => {
    const value = orderData?.orderNumber || orderData?._id
    if (!value) return
    navigator.clipboard?.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // Pads single-digit numbers with a leading zero for the timer display
  const pad = n => String(Math.floor(n)).padStart(2, '0')

  const hours = Math.floor(secondsLeft / 3600)
  const minutes = Math.floor((secondsLeft % 3600) / 60)
  const seconds = secondsLeft % 60

  // Timer turns red when under 1 hour remaining
  const isUrgent = hours < 1 && secondsLeft > 0
  const isExpired = secondsLeft === 0

  // Formats a naira amount with commas e.g. 1000000 → "1,000,000 NGN"
  const formatNGN = (amount) =>
    `${Number(amount).toLocaleString('en-NG')} NGN`

  // Formats the ISO createdAt to "YYYY-MM-DD  HH:MM:SS"
  const formatOrderTime = (iso) => {
    const d = new Date(iso)
    const date = d.toISOString().slice(0, 10)
    const time = d.toTimeString().slice(0, 8)
    return `${date}  ${time}`
  }

  const activeListing = listingData || listing

  // Truncated description 
  const TRUNCATE_LENGTH = 80
  const shortDesc = activeListing.description.length > TRUNCATE_LENGTH
    ? activeListing.description.slice(0, TRUNCATE_LENGTH) + '...'
    : activeListing.description

  if (isLoading) {
    return (
      <PageSetup>
        <Header backIcon={true} pageTitle={<h2>Preview Order</h2>} />
        <div className="main-content">
          <div className="content">
            <div className="op-card">Loading property...</div>
          </div>
        </div>
      </PageSetup>
    )
  }

  if (error) {
    return (
      <PageSetup>
        <Header backIcon={true} pageTitle={<h2>Preview Order</h2>} />
        <div className="main-content">
          <div className="content">
            <div className="op-card">{error}</div>
          </div>
        </div>
      </PageSetup>
    )
  }

  return (
    <PageSetup>
      <Header
        backIcon = {true}
        pageTitle={<h2>Preview Order</h2>}
        
      />
      <div className="main-content">
        <div className="content">
          <div className="order-preview">
            {/* ==========================================================
              1. COUNTDOWN TIMER
              Shows how much of the 72-hour payment window remains.
              Turns urgent (red) under 1 hour. Shows "Expired" at zero.
              ========================================================== */}
            <div className="op-card op-card-timer">
              <div className="op-timer-top">
                <span className="op-timer-label">
                  {!orderStarted
                    ? 'Place order to start payment window'
                    : isExpired
                      ? 'Payment Window Closed'
                      : 'Complete Your Payment Within'}
                </span>

                {/* Timer blocks */}
                {orderStarted && !isExpired && (
                  <div className="op-timer-blocks" aria-live="polite" aria-label={`${pad(hours)} hours ${pad(minutes)} minutes ${pad(seconds)} seconds remaining`}>
                    <span className={`op-timer-block ${isUrgent ? 'op-timer-block-urgent' : ''}`}>
                      {pad(hours)}
                    </span>
                    <span className="op-timer-sep">:</span>
                    <span className={`op-timer-block ${isUrgent ? 'op-timer-block-urgent' : ''}`}>
                      {pad(minutes)}
                    </span>
                    <span className="op-timer-sep">:</span>
                    <span className={`op-timer-block ${isUrgent ? 'op-timer-block-urgent' : ''}`}>
                      {pad(seconds)}
                    </span>
                  </div>
                )}

                {orderStarted && isExpired && (
                  <span className="op-timer-expired-badge">Expired</span>
                )}
              </div>

              <ul className="op-timer-notes">
                <li>Maximum payment time frame for rent is {PAYMENT_WINDOW_HOURS} hours</li>
                <li>We advise you to inspect the property before paying</li>
              </ul>
            </div>

            {/* =============================================================
              2. PROPERTY SNAPSHOT
              Mirrors the PropertyCard layout but condensed for the order
              context — image, meta chips, truncated description, features.
            ================================================================= */}
            <div className="op-card op-card-snapshot">

              {/* Property image — first from images[] or placeholder */}
              {activeListing.images?.[0] ? (
                <img
                  src={activeListing.images[0]}
                  alt={activeListing.title}
                  className="op-snapshot-image"
                />
              ) : (
                // Placeholder shown when no image is available yet
                <div className="op-snapshot-placeholder" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
              )}

              <div className="op-snapshot-body">
                <h3 className="op-snapshot-title">{activeListing.title}</h3>
                {/* Meta chips — reuses .property-meta-chip from
                    PropertyCard.css  */}
                <div className="request-chips">
                  {activeListing.bedrooms && (
                    <span className="request-chip request-chip--category">
                      <MdOutlineBedroomParent aria-hidden="true" />
                      {activeListing.bedrooms}
                    </span>
                  )}
                  {activeListing.category && (
                    <span className="request-chip request-chip--category">
                      <LuBuilding2 aria-hidden="true" />
                      {activeListing.category}
                    </span>
                  )}
                  {activeListing.location && (
                    <span className="request-chip request-chip--category">
                      <GrLocation aria-hidden="true" />
                      {activeListing.location}
                    </span>
                  )}
                </div>

                {/* Truncated description with expand toggle */}
                <p className="op-snapshot-desc">
                  {descExpanded ? activeListing.description : shortDesc}
                  {activeListing.description.length > TRUNCATE_LENGTH && (
                    <button
                      className="op-snapshot-more-btn"
                      onClick={() => setDescExpanded(p => !p)}
                    >
                      {descExpanded ? 'less' : 'more'}
                    </button>
                  )}
                </p>

                {/* Feature tags row — same .request-chip-category style */}
                {activeListing.features?.length > 0 && (
                  <div className="request-chips">
                    {(Array.isArray(activeListing.features)
                      ? activeListing.features
                      : [activeListing.features]
                    ).map((feat) => (
                      <span key={feat} className="request-chip request-chip--budget">
                        {feat}
                      </span>
                    ))}
                  </div>
                )}

              </div>
            </div>

            {/* =====================================================
                3. PRICING BREAKDOWN
            ========================================================= */}
            <div className="op-card op-card-breakdown">

              <div className="op-breakdown-row">
                <span className="op-breakdown-label">Amount</span>
                <span className="op-breakdown-value">{formatNGN(activeListing.amount)}</span>
              </div>

              <div className="op-breakdown-row">
                <span className="op-breakdown-label">Commission</span>
                <span className="op-breakdown-value">{formatNGN(activeListing.commission)}</span>
              </div>

              {/* Total — visually emphasised with larger text and primary colour */}
              <div className="op-breakdown-row op-breakdown-row-total">
                <span className="op-breakdown-label">Total Payment</span>
                <span className="op-breakdown-value op-breakdown-value-total">
                  {formatNGN(activeListing.amount + activeListing.commission)}
                </span>
              </div>

            </div>

            {/* ==========================================================
              4. ORDER META + CONTACT AGENT
            ============================================================= */}
            <div className="op-card op-card-meta">
              {/* Contact agent — top of card, right-aligned */}
              <div className="op-meta-agent-row">
                <button
                  className="op-contact-agent-btn"
                  onClick={handleContactAgent}
                >
                  <RiCustomerServiceLine aria-hidden="true" />
                  Contact Agent
                </button>
              </div>

              {/* Order number with copy button */}
              <div className="op-meta-row">
                <span className="op-meta-label">Order No.</span>
                <span className="op-meta-value">
                  {orderData?.orderNumber || orderData?._id || "Not placed yet"}
                  <button
                    className={`op-copy-btn ${copied ? 'op-copy-btn-copied' : ''}`}
                    onClick={copyOrderNumber}
                    aria-label="Copy order number"
                    title={copied ? 'Copied!' : 'Copy order number'}
                  >
                    {/* MdContentCopy icon */}
                    <MdContentCopy aria-hidden="true" />
                  </button>
                </span>
              </div>

              {/* Order timestamp */}
              <div className="op-meta-row">
                <span className="op-meta-label">Order Time</span>
                <span className="op-meta-value">
                  {orderData?.createdAt ? formatOrderTime(orderData.createdAt) : "—"}
                </span>
              </div>

            </div>

            {/* ==============================================
                5. CANCEL / PAY ACTIONS
                Cancel is destructive — red, left.
                Pay Now is the primary CTA — green gradient, right.
                Both disabled when payment window has expired.
              ==============================================*/}
            <div className="op-actions">
              {!orderStarted ? (
                <button
                  className="op-btn op-btn-pay"
                  onClick={async () => {
                    if (isPlacing || !propertyId) return
                    const token = localStorage.getItem("token")
                    if (!token) return
                    setIsPlacing(true)
                    try {
                      const res = await axios.post(
                        "https://newprojectbackend-5axx.onrender.com/orders",
                        { propertyId },
                        { headers: { Authorization: `Bearer ${token}` } }
                      )
                      setOrderData(res.data.order)
                      setOrderStarted(true)
                    } catch (err) {
                      // keep silent; top error block will show when needed
                    } finally {
                      setIsPlacing(false)
                    }
                  }}
                  disabled={isPlacing}
                >
                  {isPlacing ? "Placing Order..." : "Place Order"}
                </button>
              ) : (
                <>
                  <button
                    className="op-btn op-btn-cancel"
                    onClick={onCancel}
                    disabled={isExpired}
                  >
                    Cancel Order
                  </button>
                  <button
                    className="op-btn op-btn-pay"
                    onClick={onPay}
                    disabled={isExpired}
                  >
                    Pay Now
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
        {/* === Sidebar === */}
        <div className="sidebar">
          
        </div>
      </div>
    </PageSetup>
  )
}

export default OrderPreview
