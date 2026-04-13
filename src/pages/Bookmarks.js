import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { SideNav, Header, IconNav, PageSetup, PropertyCard, RequestCard } from '../exports'
import { RiMessageLine } from 'react-icons/ri'
import { FaRegBell, FaBookmark } from 'react-icons/fa'
import { timeAgo } from '../components/Time'
import { useAuth } from "../context/AuthProvider"
import defaultAvatar from "../assets/img/avatar.png"
import './Bookmarks.css'

function Bookmarks() {
  const [items, setItems]       = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const isUserAgent = user?.kycStatus === 'verified'

  useEffect(() => {
    const fetchBookmarks = async () => {
      setIsLoading(true)
      const token = localStorage.getItem("token")
      if (!token) {
        setItems([])
        setIsLoading(false)
        return
      }

      try {
        const res = await axios.get("https://newprojectbackend-5axx.onrender.com/bookmarks", {
          headers: { Authorization: `Bearer ${token}` },
        })

        const mapped = (res.data.bookmarks || [])
          .map((bookmark) => {
            const target = bookmark.target || bookmark.targetId
            if (!target) return null

            const type = (bookmark.targetType || "").toLowerCase()

            if (type === "property" || type === "listing") {
              return {
                type: "listing",
                // Preserve bookmark date so we can sort the unified feed chronologically.
                bookmarkedAt: bookmark.createdAt,
                id: target._id,
                ownerId: target.owner?._id || "",
                avatar: target.owner?.avatar || defaultAvatar,
                username: target.owner?.fullName || target.owner?.username || "",
                handle: target.owner?.username ? `@${target.owner.username}` : "",
                isVerified: target.owner?.kycStatus === "verified",
                isPremium: target.owner?.plan === "premium" || target.owner?.plan === "pro",
                time: timeAgo(target.createdAt),
                // image: (target.media || [])
                //   .map((m) => (typeof m === "string" ? m : m?.url))
                //   .filter(Boolean),
                image: (target.media || []).map((m) => typeof m === "string"
                  ? { url: m, mimeType: "image/jpeg" }   // legacy string — assume image
                  : { url: m?.url, mimeType: m?.mimeType || "image/jpeg" }
                  ).filter((m) => m.url),
                price: Number(target.amount),
                commission: Number(target.commission) || 0,
                priceLabel: target.listing_type === "rent"
                  ? "/yr"
                  : target.listing_type === "shortlet"
                    ? "/night"
                    : "",
                location: [target.location?.town, target.location?.state]
                  .filter(Boolean).join(", "),
                category: target.property_type
                  ? target.property_type.charAt(0).toUpperCase() + target.property_type.slice(1)
                  : "",
                listingType: target.listing_type,
                bedrooms: target.bedrooms || "",
                features: target.features || [],
                likes: String(target.likeCount || 0),
                likedByMe: user?.id
                  ? (target.likes || []).some((id) => String(id) === String(user.id))
                  : false,
                comments: String(target.commentCount || 0),
                bookmarked: true,
                isUnavailable: target.status !== "available",
                description: target.description,
              }
            }

            if (type === "request") {
              return {
                type: "request",
                // Preserve bookmark date so we can sort the unified feed chronologically.
                bookmarkedAt: bookmark.createdAt,
                id: target._id,
                requesterId: target.requester?._id || "",
                avatar: target.requester?.avatar || defaultAvatar,
                username: target.requester?.fullName || target.requester?.username || "",
                handle: target.requester?.username ? `@${target.requester.username}` : "",
                isAgent: target.requester?.role === "agent" || target.requester?.kycStatus === "verified",
                isPremium: target.requester?.plan === "premium" || target.requester?.plan === "pro",
                time: timeAgo(target.createdAt),
                description: target.description,
                category: target.category,
                location: [target.location?.town, target.location?.state]
                  .filter(Boolean).join(", "),
                budget: target.budget,
                likes: String(target.likeCount || 0),
                likedByMe: user?.id
                  ? (target.likes || []).some((id) => String(id) === String(user.id))
                  : false,
                responseCount: String(target.responseCount || 0),
                discussionCount: String(target.discussionCount || 0),
                agentResponses: [],
                discussionItems: [],
                bookmarked: true,
                expired: target.status === "expired",
                daysLeft: target.expiresAt
                  ? Math.max(0, Math.ceil((new Date(target.expiresAt) - Date.now()) / 86_400_000))
                  : null,
              }
            }

            return null
          })
          .filter(Boolean)
          // Sort unified feed: most recently bookmarked first.
          .sort((a, b) => new Date(b.bookmarkedAt) - new Date(a.bookmarkedAt))

        setItems(mapped)
      } catch (err) {
        console.error("Failed to load bookmarks:", err)
        setItems([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookmarks()
  }, [user?.id])

  return (
    <PageSetup>
      <SideNav />
      <Header
        pageTitle={<h2>Bookmarks</h2>}
        icons={[
          { link: "/inbox",         element: <RiMessageLine /> },
          { link: "/notifications", element: <FaRegBell />    },
        ]}
      />

      <div className="main-content">
        <div className="content">
          {isLoading ? (
            /* === LOADING STATE ============================= */
            <div className="bookmarks-loading">
              {[0, 1, 2].map((i) => (
                <div key={i} className="bookmarks-skeleton-card">
                  <div className="skeleton bookmarks-skeleton-header" />
                  <div className="skeleton bookmarks-skeleton-image" />
                  <div className="skeleton bookmarks-skeleton-line" />
                  <div className="skeleton bookmarks-skeleton-line bookmarks-skeleton-line--short" />
                </div>
              ))}
            </div>
          ) : items.length > 0 ? (
            /* === UNIFIED FEED ============================== */
            <>
              <div className="bookmarks-header">
                <p className="bookmarks-count">
                  <FaBookmark aria-hidden="true" />
                  {items.length} saved {items.length === 1 ? 'item' : 'items'}
                </p>
              </div>

              <div className="bookmarks-feed">
                {items.map((item) =>
                  item.type === "listing" ? (
                    <PropertyCard
                      key={`listing-${item.id}`}
                      {...item}
                      propertyId={item.id}
                      isUnavailable={item.isUnavailable}
                    />
                  ) : (
                    <RequestCard
                      key={`request-${item.id}`}
                      {...item}
                      requestId={item.id}
                      likedByMe={item.likedByMe}
                      currentUserIsAgent={isUserAgent}
                    />
                  )
                )}
              </div>
            </>
          ) : (
            /* === EMPTY STATE =============================== */
            <div className="bookmarks-empty">
              <div className="empty-icon">
                <FaBookmark size={40} />
              </div>
              <h3>Nothing saved yet</h3>
              <p>Tap the bookmark icon on any listing or request to save it here.</p>
            </div>
          )}
        </div>

        <div className="sidebar">
          {/* Optional sidebar content could go here */}
        </div>
      </div>
    </PageSetup>
  )
}

export default Bookmarks