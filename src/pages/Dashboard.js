import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header, ClickButton, PageSetup, PropertyCard, RequestCard, UpgradeWidget,
} from '../exports'
import axios from 'axios'
import { useAuth } from "../context/AuthProvider"
import { RiMessageLine, RiAddCircleLine } from 'react-icons/ri'
import { FaRegBell } from 'react-icons/fa'
import { timeAgo } from "../components/Time"
import defaultAvatar from "../assets/img/avatar.png"
import '../assets/css/global.css'
import './Dashboard.css'

// ========================================================
//  MAIN DASHBOARD COMPONENT
// ========================================================
function Dashboard() {
  const navigate = useNavigate()

  // === Feed state =========
  const [feed, setFeed]      = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const isUserAgent = user?.kycStatus === 'verified'

  // === Active orders state (for disabling Preview buttons) ===
  const [activeOrderPropertyIds, setActiveOrderPropertyIds] = useState(new Set())
  const [isOrdersLoading, setIsOrdersLoading] = useState(true)
  
  // === Fetch active orders on mount ===
  useEffect(() => {
    const fetchActiveOrders = async () => {
      setIsOrdersLoading(true)
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setIsOrdersLoading(false)
          return
        }
        // Fetch user's orders
        const res = await axios.get("https://newprojectbackend-5axx.onrender.com/orders", {
          headers: { Authorization: `Bearer ${token}` }
        })
        const orders = res.data.items || []

        // Filter orders that are still active (not completed/cancelled/expired)
        const activeStatuses = ["pending", "accepted", "completed"]
        const propertyIds = orders
          .filter(order => activeStatuses.includes(order.status))
          .map(order => order.property?._id)
          .filter(id => id) // remove undefined
       
          setActiveOrderPropertyIds(new Set(propertyIds))
      } catch (err) {
        console.error("Failed to fetch active orders:", err)
      } finally {
        setIsOrdersLoading(false)
      }
    }
    
    fetchActiveOrders()
  }, [])

  // === Fetch feed on mount ===
  useEffect(() => {
    const fetchFeed = async () => {
      setIsLoading(true)
      try{
        const token = localStorage.getItem("token")
        const headers = token ? { Authorization: `Bearer ${token}` } : {}

        const listingRes = await axios.get("https://newprojectbackend-5axx.onrender.com/properties?status=available", { headers })
        const requestRes = await axios.get("https://newprojectbackend-5axx.onrender.com/requests", { headers })
        
        const listings = (listingRes.data.items || []).map((p) => ({
          type: "listing",
          id: p._id,
          ownerId: p.owner?._id || "",
          avatar: p.owner?.avatar || defaultAvatar,
          username: p.owner?.fullName || p.owner?.username || "",
          handle: p.owner?.username ? `@${p.owner.username}` : "",
          isVerified: p.owner?.kycStatus === "verified",
          isPremium: p.owner?.plan === "premium" || p.owner?.plan === "pro",
          time: timeAgo(p.createdAt),
          // Handle both string media arrays and {url} objects.
          image: (p.media || []).map((m) => typeof m === "string"
            ? { url: m, mimeType: "image/jpeg" }   // legacy string — assume image
            : { url: m?.url, mimeType: m?.mimeType || "image/jpeg" }
            ).filter((m) => m.url),
          // Keep numeric price for accurate calculations in PropertyCard.
          price: Number(p.amount),
          commission: Number(p.commission) || 0,
          priceLabel: p.listing_type === "rent" ? "/yr" : p.listing_type === "shortlet" ? "/night" : "",
          location: [p.location?.town, p.location?.state].filter(Boolean).join(", "),
          category: p.property_type.charAt(0).toUpperCase() + p.property_type.slice(1),
          listingType: p.listing_type,
          bedrooms: p.bedrooms || "",
          features: p.features || [],
          likes: String(p.likeCount || 0),
          likedByMe: p.likedByMe || false,
          comments: String(p.commentCount || 0),
          bookmarked: p.bookmarkedByMe || false,
          description: p.description,
        }))

        const requests = (requestRes.data.items || []).map((r) => ({
          type: "request",
          id: r._id,
          requesterId: r.requester?._id || "",
          // Owner fields — now populated
          avatar: r.requester?.avatar   || defaultAvatar,
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
          // agentResponses and discussionItems are loaded lazily inside
          // RequestResponsesModal when the user taps "See Responses" —
          // they don't need to be in the feed payload
          agentResponses:  [],
          discussionItems: [],
          bookmarked: r.bookmarkedByMe || false,
          expired: r.status === "expired",
          daysLeft: r.expiresAt ? Math.max(0, Math.ceil((new Date(r.expiresAt) - Date.now()) / 86_400_000)) : null,
        }))

      const merged = [...listings, ...requests].sort(
        (a, b) => new Date(b.time) - new Date(a.time)
      )

      setFeed(merged)  
      }catch(err){
      
      }finally{
        setIsLoading(false)
      }
    }
    fetchFeed()
  }, [])

  // === Navigation handlers ===
  const handleCreatePost = () => navigate('/create/post-a-request')
  const handleOrder = (id) => navigate(`/listing/${id}/order`)
  const handleRespond = (id) => navigate(`/requests/${id}/respond`)

  // Wait for both feed and orders to load before showing "loading" skeleton
  const isLoadingComplete = isLoading || isOrdersLoading
  return (
    <PageSetup>
      <Header
        pageTitle={<h2>Home</h2>}
        icons={[
          { link: '/inbox', element: <RiMessageLine /> },
          { link: '/notifications', element: <FaRegBell />     },
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

          {/* ====== FEED CONTENT AREA ======
              Three states: loading → items → empty.
              Both PropertyCard and RequestCard render in the same loop —
              item.type decides which component to use.
          ── */}
          {isLoadingComplete ? (
            <div className="feed-loading">
              <div className="skeleton skeleton-card"></div>
              <div className="skeleton skeleton-card"></div>
              <div className="skeleton skeleton-card"></div>
            </div>
          ) : feed.length > 0 ? (
            // Mixed feed — one loop, two card types
            feed.map(item =>
              item.type === 'listing' ? (
                // PropertyCard 
                <PropertyCard
                  key={item.id}
                  {...item}
                  propertyId={item.id}
                  isOrdered={activeOrderPropertyIds.has(item.id)}
                  onOrder={() => handleOrder(item.id)}
                />
              ) : (
                // currentUserIsAgent 
                <RequestCard
                  key={item.id}
                  {...item}
                  requestId={item.id}
                  likedByMe={item.likedByMe}
                  currentUserIsAgent={isUserAgent}
                  onRespond={() => handleRespond(item.id)}
                />

              )
            )

          ) : (

            // Empty state — tab-aware message
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

        {/* === Sidebar === */}
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

export default Dashboard
