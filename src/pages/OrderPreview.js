import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { Header, Loader, PageSetup } from '../exports'
import { GrLocation } from 'react-icons/gr'
import { MdOutlineBedroomParent } from 'react-icons/md'
import { LuBuilding2 } from 'react-icons/lu'
import { RiCustomerServiceLine } from 'react-icons/ri'
import './OrderPreview.css'

const PAYMENT_WINDOW_HOURS = 72

const OrderPreview = () => {
  const { propertyId } = useParams()
  const navigate = useNavigate()

  const [listingData, setListingData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPlacing, setIsPlacing] = useState(false)
  const [descExpanded, setDescExpanded] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!propertyId) {
      setIsLoading(false)
      setError('Missing property id')
      return
    }

    const fetchProperty = async () => {
      setIsLoading(true)
      setError('')

      try {
        const res = await axios.get(`https://newprojectbackend-5axx.onrender.com/properties/${propertyId}`)
        const p = res.data?.property

        if (!p) {
          setError('Property not found')
          setListingData(null)
          return
        }

        setListingData({
          id: p._id,
          ownerId: p.owner?._id || '',
          title: p.title || '',
          images: (p.media || []).map((m) => (typeof m === 'string' ? m : m?.url)).filter(Boolean),
          description: p.description || '',
          location: [p.location?.town, p.location?.state].filter(Boolean).join(', '),
          category: p.property_type ? p.property_type.charAt(0).toUpperCase() + p.property_type.slice(1) : '',
          bedrooms: p.bedrooms || '',
          listingType: p.listing_type || '',
          features: (() => {
            const raw = p.features
            if (Array.isArray(raw)) return raw
            if (typeof raw === 'string') {
              const trimmed = raw.trim()
              if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
                try {
                  const parsed = JSON.parse(trimmed)
                  return Array.isArray(parsed) ? parsed : [parsed]
                } catch {
                  // Fall through to the comma split fallback below.
                }
              }
              return trimmed.split(',').map((s) => s.trim()).filter(Boolean)
            }
            return []
          })(),
          amount: Number(p.amount) || 0,
          commission: Number(p.commission) || 0,
        })
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load property')
        setListingData(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProperty()
  }, [propertyId])

  const handleContactAgent = () => {
    if (!listingData?.ownerId) return
    navigate(`/inbox?agentId=${listingData.ownerId}`)
  }

  const handlePlaceOrder = async () => {
    if (isPlacing || !propertyId) return

    const token = localStorage.getItem('token')
    if (!token) return

    setIsPlacing(true)
    setError('')

    try {
      const res = await axios.post(
        'https://newprojectbackend-5axx.onrender.com/orders',
        { propertyId },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const createdOrder = res.data?.order
      if (!createdOrder?._id) {
        throw new Error('Order was created, but the order id was missing.')
      }

      // Once the order exists, hand the buyer off to the live status page.
      navigate(`/orders/${createdOrder._id}/status`, {
        state: { rawOrder: createdOrder },
      })
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to place order')
    } finally {
      setIsPlacing(false)
    }
  }

  const formatNGN = (amount) => `${Number(amount || 0).toLocaleString('en-NG')} NGN`
  const activeListing = listingData
  const totalPayment = (activeListing?.amount || 0) + (activeListing?.commission || 0)
  const shortDesc = (activeListing?.description || '').length > 80
    ? `${activeListing.description.slice(0, 80)}...`
    : activeListing?.description || ''

  if (isLoading) {
    return (
      <PageSetup>
        <Header backIcon={true} pageTitle={<h2>Preview Order</h2>} />
        <div className="main-content">
          <Loader />
        </div>
      </PageSetup>
    )
  }

  return (
    <PageSetup>
      <Header backIcon={true} pageTitle={<h2>Preview Order</h2>} />

      <div className="main-content">
        <div className="content">
          <div className="order-preview">
            {error && (
              <div className="submit-error">{error}</div>
            )}

            <div className="op-card op-card-timer">
              <div className="op-timer-top">
                <span className="op-timer-label">72-hour reservation window</span>
              </div>
              <ul className="op-timer-notes">
                <li>The live countdown starts on the Order Status page after submission.</li>
                <li>You can still contact the agent before placing the order.</li>
                <li>Orders that are not completed within {PAYMENT_WINDOW_HOURS} hours are auto-cancelled.</li>
              </ul>
            </div>

            <div className="op-card op-card-snapshot">
              {activeListing?.images?.[0] ? (
                <img
                  src={activeListing.images[0]}
                  alt={activeListing.title}
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
                <h3 className="op-snapshot-title">{activeListing?.title}</h3>

                <div className="request-chips">
                  {activeListing?.bedrooms && (
                    <span className="request-chip request-chip--category">
                      <MdOutlineBedroomParent aria-hidden="true" />
                      {activeListing.bedrooms}
                    </span>
                  )}
                  {activeListing?.category && (
                    <span className="request-chip request-chip--category">
                      <LuBuilding2 aria-hidden="true" />
                      {activeListing.category}
                    </span>
                  )}
                  {activeListing?.location && (
                    <span className="request-chip request-chip--category">
                      <GrLocation aria-hidden="true" />
                      {activeListing.location}
                    </span>
                  )}
                </div>

                <p className="op-snapshot-desc">
                  {descExpanded ? activeListing?.description : shortDesc}
                  {(activeListing?.description || '').length > 80 && (
                    <button
                      className="op-snapshot-more-btn"
                      onClick={() => setDescExpanded((prev) => !prev)}
                    >
                      {descExpanded ? 'less' : 'more'}
                    </button>
                  )}
                </p>

                {activeListing?.features?.length > 0 && (
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

            <div className="op-card op-card-breakdown">
              <div className="op-breakdown-row">
                <span className="op-breakdown-label">Amount</span>
                <span className="op-breakdown-value">{formatNGN(activeListing?.amount)}</span>
              </div>

              <div className="op-breakdown-row">
                <span className="op-breakdown-label">Commission</span>
                <span className="op-breakdown-value">{formatNGN(activeListing?.commission)}</span>
              </div>

              <div className="op-breakdown-row op-breakdown-row-total">
                <span className="op-breakdown-label">Total Payment</span>
                <span className="op-breakdown-value op-breakdown-value-total">
                  {formatNGN(totalPayment)}
                </span>
              </div>
            </div>

            <div className="op-card op-card-meta">
              <div className="op-meta-agent-row">
                <button
                  className="op-contact-agent-btn"
                  onClick={handleContactAgent}
                >
                  <RiCustomerServiceLine aria-hidden="true" />
                  Contact Agent
                </button>
              </div>

              <div className="op-meta-row">
                <span className="op-meta-label">Property</span>
                <span className="op-meta-value">{activeListing?.title || 'Listing'}</span>
              </div>
            </div>

            <div className="op-card">
              <div className="op-actions">
                <button
                  className="op-btn op-btn-pay"
                  onClick={handlePlaceOrder}
                  disabled={isPlacing}
                >
                  {isPlacing ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="sidebar" />
      </div>
    </PageSetup>
  )
}

export default OrderPreview
