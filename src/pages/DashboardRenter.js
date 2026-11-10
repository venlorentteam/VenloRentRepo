import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header, ClickButton, PageSetup, PropertyCard, RequestCard, UpgradeWidget } from '../exports'
import axios from 'axios'
import { API_BASE } from "../config/api"
import { RiMessageLine, RiAddCircleLine } from 'react-icons/ri'
import { FaRegBell } from 'react-icons/fa'
import { timeAgo } from "../components/Time"
import defaultAvatar from "../assets/img/avatar.png"
// import '../assets/css/global.css'
// import './Dashboard.css'

// Treat a request as expired when either the backend says so or the
// expiry timestamp has already passed.
const isRequestExpired = (item) =>
  item.status === "expired" ||
  (item.expiresAt && new Date(item.expiresAt) <= Date.now())

const capitalizeWords = (str = "") =>
  str.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("-")

// Interleaves score-ordered listings with chronologically-ordered requests,
// without re-sorting either list. One request every `requestFrequency` listings.
const weaveFeed = (rankedListings, chronologicalRequests, requestFrequency = 4) => {
  const merged = []
  let requestIndex = 0

  rankedListings.forEach((listing, i) => {
    merged.push(listing)
    if ((i + 1) % requestFrequency === 0 && requestIndex < chronologicalRequests.length) {
      merged.push(chronologicalRequests[requestIndex])
      requestIndex++
    }
  })

  while (requestIndex < chronologicalRequests.length) {
    merged.push(chronologicalRequests[requestIndex])
    requestIndex++
  }

  return merged
}

function DashboardRenter() {
  const navigate = useNavigate()

  const [feed, setFeed] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const [activeOrderPropertyIds, setActiveOrderPropertyIds] = useState(new Set())
  const [isOrdersLoading, setIsOrdersLoading] = useState(true)

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
    const fetchFeed = async () => {
      setIsLoading(true)
      try {
        const token = localStorage.getItem("token")
        const headers = { Authorization: `Bearer ${token}` }

        const listingRes = await axios.get(`${API_BASE}/feed`, { headers })
        const requestRes = await axios.get(`${API_BASE}/requests`, { headers })

        const listings = (listingRes.data.items || []).map((p) => ({
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
          commission: Number(p.commission) || 0,
          priceLabel: p.listing_type === "rent" ? "/yr" : p.listing_type === "shortlet" ? "/night" : "",
          location: [p.location?.town, p.location?.state].filter(Boolean).join(", "),
          category: capitalizeWords(p.property_type),
          listingType: p.listing_type,
          bedrooms: p.bedrooms || "",
          features: p.features || [],
          likes: String(p.likeCount || 0),
          likedByMe: p.likedByMe || false,
          comments: String(p.commentCount || 0),
          bookmarked: p.bookmarkedByMe || false,
          description: p.description,
        }))

        const requests = (requestRes.data.items || [])
          .map((r) => ({
            type: "request",
            id: r._id,
            createdAt: r.createdAt,
            requesterId: r.requester?._id || "",
            avatar: r.requester?.avatar || defaultAvatar,
            username: r.requester?.fullName || r.requester?.username || "",
            handle: r.requester?.username ? `@${r.requester.username}` : "",
            isAgent: r.requester?.role === "agent" || r.requester?.kycStatus === "verified",
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
            expired: isRequestExpired(r),
            daysLeft: r.expiresAt ? Math.max(0, Math.ceil((new Date(r.expiresAt) - Date.now()) / 86_400_000)) : null,
          }))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

        const merged = weaveFeed(listings, requests)
        setFeed(merged)
      } catch (err) {
        // TODO: surface this to the UI instead of swallowing it
      } finally {
        setIsLoading(false)
      }
    }
    fetchFeed()
  }, [])

  const handleCreatePost = () => navigate('/create-list')
  const handleCreateRequest = () => navigate('/post-a-request')
  const handleOrder = (id) => navigate(`/listing/${id}/order`)
  const handleRespond = (id) => navigate(`/requests/${id}/respond`)

  const handleDeleteProperty = (deletedId) => {
    setFeed((prev) => prev.filter((item) => !(item.type === "listing" && item.id === deletedId)))
  }
  const handleDeleteRequest = (deletedId) => {
    setFeed((prev) => prev.filter((item) => !(item.type === "request" && item.id === deletedId)))
  }

  const isLoadingComplete = isLoading || isOrdersLoading

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
            text="Post Request"
            icon={<RiAddCircleLine />}
            onClick={handleCreateRequest}
            variant="primary"
            size="medium"
          />
        }
      />

      <div className="main-content">
        <div className="content">
          {isLoadingComplete ? (
            <div className="feed-loading">
              <div className="skeleton skeleton-card"></div>
              <div className="skeleton skeleton-card"></div>
              <div className="skeleton skeleton-card"></div>
            </div>
          ) : feed.length > 0 ? (
            feed.map(item =>
              item.type === 'listing' ? (
                <PropertyCard
                  key={item.id}
                  {...item}
                  propertyId={item.id}
                  isOrdered={activeOrderPropertyIds.has(item.id)}
                  onOrder={() => handleOrder(item.id)}
                  onDelete={handleDeleteProperty}
                />
              ) : (
                <RequestCard
                  key={item.id}
                  {...item}
                  requestId={item.id}
                  likedByMe={item.likedByMe}
                  currentUserIsAgent={false}
                  onRespond={() => handleRespond(item.id)}
                  onDelete={handleDeleteRequest}
                />
              )
            )
          ) : (
            <div className="feed-empty">
              <h3>No posts yet</h3>
              <p>Be the first to post a property or a request!</p>
              <ClickButton
                text="Create Post"
                onClick={handleCreatePost}
                variant="primary"
              />
            </div>
          )}
        </div>

        <div className="sidebar">
          <UpgradeWidget
            title="Become a Verified Agent"
            text="Get verified to list properties and connect with more clients!"
            features={[
              'List unlimited properties',
              'Get verified badge',
              'Priority support',
              'Boost your listings',
            ]}
            onClick={() => navigate('/account/verification')}
          />
        </div>
      </div>
    </PageSetup>
  )
}

export default DashboardRenter