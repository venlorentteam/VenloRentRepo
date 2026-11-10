import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header, ClickButton, PageSetup, PropertyCard, RequestCard, UpgradeWidget } from '../exports'
import axios from 'axios'
import { API_BASE } from "../config/api"
import { RiMessageLine, RiAddCircleLine } from 'react-icons/ri'
import { FaRegBell } from 'react-icons/fa'
import { timeAgo } from "../components/Time"
import defaultAvatar from "../assets/img/avatar.png"
//import '../assets/css/global.css'
import './Dashboard.css'

const capitalizeWords = (str = "") =>
  str.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("-")

function DashboardAgent() {
  const navigate = useNavigate()

  const [myListings, setMyListings] = useState([])
  const [matchedRequests, setMatchedRequests] = useState([])
  const [marketListings, setMarketListings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)
  const [activeOrderPropertyIds, setActiveOrderPropertyIds] = useState(new Set())
  const [isOrdersLoading, setIsOrdersLoading] = useState(true)

  const MARKET_PREVIEW_COUNT = 8
  const [showAllMarket, setShowAllMarket] = useState(false)

  const visibleMarketListings = showAllMarket
    ? marketListings
    : marketListings.slice(0, MARKET_PREVIEW_COUNT)

  useEffect(() => {
    const fetchActiveOrders = async () => {
      setIsOrdersLoading(true)
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setIsOrdersLoading(false)
          return
        }
        const res = await axios.get(`${API_BASE}/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const orders = res.data.items || []
        const activeStatuses = ["pending", "accepted"]
        const propertyIds = orders
          .filter(order => activeStatuses.includes(order.status) || order.paymentStatus === "pending_proof")
          .map(order => order.property?._id)
          .filter(id => id)
        setActiveOrderPropertyIds(new Set(propertyIds))
      } catch (err) {
        console.error("Failed to fetch active orders:", err)
      } finally {
        setIsOrdersLoading(false)
      }
    }
    fetchActiveOrders()
  }, [])

  useEffect(() => {
    const fetchAgentFeed = async () => {
      setIsLoading(true)
      try {
        const token = localStorage.getItem("token")
        const headers = { Authorization: `Bearer ${token}` }

        const res = await axios.get(`${API_BASE}/agent-feed`, { headers })

        const mappedMyListings = (res.data.myListings || []).map((p) => ({
          id: p._id,
          createdAt: p.createdAt,
          image: (p.media || []).map((m) => typeof m === "string"
            ? { url: m, mimeType: "image/jpeg" }
            : { url: m?.url, mimeType: m?.mimeType || "image/jpeg" }
            ).filter((m) => m.url),
          price: Number(p.amount),
          priceLabel: p.listing_type === "rent" ? "/yr" : p.listing_type === "shortlet" ? "/night" : "",
          location: [p.location?.town, p.location?.state].filter(Boolean).join(", "),
          category: capitalizeWords(p.property_type),
          listingType: p.listing_type,
          bedrooms: p.bedrooms || "",
          likes: String(p.likeCount || 0),
          comments: String(p.commentCount || 0),
          description: p.description,
          needsAttention: p.needsAttention,
          moderationFlag: p.moderationFlag,
        }))

        const mappedRequests = (res.data.matchedRequests || []).map((r) => ({
          type: "request",
          id: r._id,
          createdAt: r.createdAt,
          requesterId: r.requester?._id || "",
          avatar: r.requester?.avatar || defaultAvatar,
          username: r.requester?.fullName || r.requester?.username || "",
          handle: r.requester?.username ? `@${r.requester.username}` : "",
          isAgent: false,
          isPremium: r.requester?.plan === "premium" || r.requester?.plan === "pro",
          time: timeAgo(r.createdAt),
          description: r.description,
          category: r.category,
          location: [r.location?.town, r.location?.state].filter(Boolean).join(", "),
          budget: r.budget,
          likes: String(r.likeCount || 0),
          likedByMe: r.likedByMe || false,
          responseCount: String(r.responseCount || 0),
          discussionCount: String(r.discussionCount || 0),
          agentResponses: [],
          discussionItems: [],
          bookmarked: r.bookmarkedByMe || false,
        }))

        const mappedMarket = (res.data.marketListings || []).map((p) => ({
          type: "listing",
          id: p._id,
          createdAt: p.createdAt,
          ownerId: p.owner?._id || "",
          avatar: p.owner?.avatar || defaultAvatar,
          username: p.owner?.fullName || p.owner?.username || "",
          handle: p.owner?.username ? `@${p.owner.username}` : "",
          isVerified: p.owner?.kycStatus === "verified",
          isPremium: p.owner?.plan === "premium" || p.owner?.plan === "pro",
          time: timeAgo(p.createdAt),
          image: (p.media || []).map((m) => typeof m === "string"
            ? { url: m, mimeType: "image/jpeg" }
            : { url: m?.url, mimeType: m?.mimeType || "image/jpeg" }
            ).filter((m) => m.url),
          price: Number(p.amount),
          priceLabel: p.listing_type === "rent" ? "/yr" : p.listing_type === "shortlet" ? "/night" : "",
          location: [p.location?.town, p.location?.state].filter(Boolean).join(", "),
          category: capitalizeWords(p.property_type),
          listingType: p.listing_type,
          bedrooms: p.bedrooms || "",
          likes: String(p.likeCount || 0),
          likedByMe: p.likedByMe || false,
          comments: String(p.commentCount || 0),
          bookmarked: p.bookmarkedByMe || false,
          description: p.description,
        }))

        setMyListings(mappedMyListings)
        setMatchedRequests(mappedRequests)
        setMarketListings(mappedMarket)
      } catch (err) {
        //surface this to the UI instead of swallowing it
        setFetchError(err?.response?.data?.message || "Failed to fetch agent feed")
      } finally {
        setIsLoading(false)
      }
    }
    fetchAgentFeed()
  }, [])

  const handleCreatePost = () => navigate('/create/create-list')
  const handleRespond = (id) => navigate(`/requests/${id}/respond`)
  const handleOrder = (id) => navigate(`/listing/${id}/order`)
  const isStillLoading = isLoading || isOrdersLoading

  const handleDeleteMyListing = (deletedId) => {
    setMyListings((prev) => prev.filter((item) => item.id !== deletedId))
  }
  const handleDeleteMarketListing = (deletedId) => {
    setMarketListings((prev) => prev.filter((item) => item.id !== deletedId))
  }
  const handleDeleteRequest = (deletedId) => {
    setMatchedRequests((prev) => prev.filter((item) => item.id !== deletedId))
  }

  const attentionListings = myListings.filter((l) => l.needsAttention || l.moderationFlag)

  return (
    <PageSetup>
      <Header
        pageTitle={<h2>Home</h2>}
        icons={[
          { link: '/inbox', element: <RiMessageLine /> },
          { link: '/notifications', element: <FaRegBell /> },
        ]}
        button={
          <ClickButton
            text="Create"
            icon={<RiAddCircleLine />}
            onClick={handleCreatePost}
            variant="primary"
            size="medium"
          />
        }
      />

      <div className="main-content">
        <div className="content">
          {isStillLoading ? (
            <div className="feed-loading">
              <div className="skeleton skeleton-card"></div>
              <div className="skeleton skeleton-card"></div>
              <div className="skeleton skeleton-card"></div>
            </div>
          ) : (
            <>
                {fetchError && (
                  <div className="error-message">
                    {fetchError}
                  </div>
                )}
              {attentionListings.length > 0 && (
                <section className="agent-attention-strip">
                  <h3>Listings needing attention</h3>
                  <div className="agent-attention-scroll">
                    {attentionListings.map((item) => (
                      <PropertyCard
                        key={item.id}
                        {...item}
                        propertyId={item.id}
                        isOrdered={activeOrderPropertyIds.has(item.id)}
                        onOrder={() => handleOrder(item.id)}
                        onDelete={handleDeleteMyListing}
                      />
                    ))}
                  </div>
                </section>
              )}

              <section className="agent-section">
                <h3>Requests for you</h3>
                {matchedRequests.length > 0 ? (
                  matchedRequests.map((r) => (
                    <RequestCard
                      key={r.id}
                      {...r}
                      requestId={r.id}
                      likedByMe={r.likedByMe}
                      currentUserIsAgent={true}
                      onRespond={() => handleRespond(r.id)}
                      onDelete={handleDeleteRequest}
                    />
                  ))
                ) : (
                  <p className="feed-empty-inline">No matching requests yet.</p>
                )}
              </section>

              <section className="agent-section">
                <h3>What's happening in your market</h3>
                {visibleMarketListings.map((p) => (
                  <PropertyCard
                    key={p.id}
                    {...p}
                    propertyId={p.id}
                    isOrdered={activeOrderPropertyIds.has(p.id)}
                    onOrder={() => handleOrder(p.id)}
                    onDelete={handleDeleteMarketListing}
                  />
                ))}
                {!showAllMarket && marketListings.length > MARKET_PREVIEW_COUNT && (
                  <button type="button" className="show-more-btn" onClick={() => setShowAllMarket(true)}>
                    Show all {marketListings.length} listings
                  </button>
                )}
              </section>
              
            </>
          )}
        </div>
        <div className="sidebar">
          <UpgradeWidget
            title="Upgrade Your Account"
            text="Get more exposure and features for your listings by upgrading to a Pro account."
            features={[
              'All Free features', 'Unlimited messaging', 'Priority support', 'Advanced search filters', 'Save searches'
            ]}
            onClick={() => navigate('/account/verification')}
          />
        </div>  
      </div>
    </PageSetup>
  )
}

export default DashboardAgent