import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Comments, Modal, ReportModal } from '../exports'
import { AgentBadge, PremiumBadge } from './Badges'
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link } from 'react-router-dom'
import './PropertyCard.css'
//Import Icons
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io"
import { FaRegComment, FaBookmark, FaRegBookmark } from 'react-icons/fa'
import { BsThreeDots } from 'react-icons/bs'
import { GrLocation } from 'react-icons/gr'
import { MdIosShare} from 'react-icons/md'
import { LuBuilding2 } from 'react-icons/lu'

// Helper to determine if a media item is a video based on its MIME type.
const isVideo = (mimeType = "") => mimeType.startsWith("video/")

function PropertyCard({
  id = "",
  ownerId = "",
  avatar = "https://i.pravatar.cc/100",
  username = "Jay carlos",
  handle = "@jaycarlx",
  isVerified = true,
  isPremium = false,
  time = "1 min ago",
  image = [],
  price = "₦700,000",
  commission = '',
  priceLabel = "/yr",
  location = "Gwagwalada, Abuja",
  category = "Apartment",
  listingType = "",
  bedrooms = "",
  likes = "0",
  likedByMe = null,
  liked = null,
  comments = "532",
  bookmarked = false,
  description = "Self contained apartment, with steady water and light...",
  onOrder,
  isOrdered = false,
  isUnavailable = false,
  propertyId = "",
  onDelete,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isComment, setIsComment] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(bookmarked)
  // Resolve id/liked defaults so the card can accept either propertyId or id.
  const resolvedPropertyId = propertyId || id
  const initialLiked = likedByMe !== null && likedByMe !== undefined ? likedByMe : !!liked
  const [isLiked, setIsLiked] = useState(initialLiked)
  const [commentCount, setCommentCount] = useState(Number(comments) || 0)
  const [likeCount, setLikeCount] = useState(Number(likes) || 0)
  const [isLiking, setIsLiking] = useState(false)
  const [isReportOpen, setIsReportOpen] = useState(false)

  const currentUserId = (() => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return null
      return JSON.parse(atob(token.split(".")[1]))?.id || null
    } catch (_) {
      return null
    }
  })()

  const isOwner = currentUserId && String(currentUserId) === String(ownerId)

  // Keep comment count in sync with prop updates (e.g., after feed fetch).
  useEffect(() => {
    setCommentCount(Number(comments) || 0)
  }, [comments])

  // Keep bookmark state in sync when the parent updates.
  useEffect(() => {
    setIsBookmarked(!!bookmarked)
  }, [bookmarked])

  const toggleLike = async () => {
    if (!resolvedPropertyId || isLiking) return

    const token = localStorage.getItem("token")
    if (!token) return
    const next = !isLiked
    // Optimistic UI update
    setIsLiked(next)
    setLikeCount((prev) => Math.max(0, prev + (next ? 1 : -1)))
    setIsLiking(true)
    try {
      await axios.post(`https://newprojectbackend-5axx.onrender.com/properties/${resolvedPropertyId}/like`,
        { liked: next },
        { headers: { Authorization: `Bearer ${token}` } }
      )
    } catch (err) {
      console.error("Failed to update property like:", err)
      // Rollback if API fails
      setIsLiked(!next)
      setLikeCount((prev) => Math.max(0, prev + (next ? -1 : 1)))
    } finally {
      setIsLiking(false)
    }
  }
  // Control opening and closing of Comment
  const openComment = () => setIsComment(true)
  const closeComment = (e) => {
    e?.preventDefault()
    setIsComment(false)
  }

  // Control opening and closing of Modal
  const openModal = () => setIsModalOpen(true)
  const closeModal = (e) => {
    e?.preventDefault()
    setIsModalOpen(false)
  }

  const toggleBookmark = () => {
    const next = !isBookmarked
    setIsBookmarked(next)
    if (!resolvedPropertyId) return
    // Auth header is required for the protected bookmark route.
    const token = localStorage.getItem("token")
    if (!token) return
    axios.post(
      `https://newprojectbackend-5axx.onrender.com/properties/${resolvedPropertyId}/bookmark`,
      { bookmarked: next },
      { headers: { Authorization: `Bearer ${token}` } }
    ).catch((err) => {
      console.error("Failed to update property bookmark:", err)
    })
  }

  // Add delete handler
  const handleDelete = async () => {
    const token = localStorage.getItem("token")
    if (!token) return
    const confirmed = window.confirm("Are you sure you want to delete this listing? This cannot be undone.")
    if (!confirmed) return
    try {
      await axios.delete(
        `https://newprojectbackend-5axx.onrender.com/properties/${resolvedPropertyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      closeModal()
      // Notify parent to remove card from feed if callback exists
      if (onDelete) onDelete(resolvedPropertyId)
    } catch (err) {
      console.error("Failed to delete property:", err)
      alert(err.response?.data?.message || "Failed to delete listing. Please try again.")
    }
  }

  // Add report handler
  const handleReport = async () => {
    const token = localStorage.getItem("token")
    if (!token) return
    try {
      await axios.post(
        `https://newprojectbackend-5axx.onrender.com/properties/${resolvedPropertyId}/report`,
        { reason: "Reported by user" },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      closeModal()
      //alert("Report submitted. Thank you for keeping VenloRent safe.")
    } catch (err) {
      console.error("Failed to report property:", err)
    }
  }

  const handleOrder = () => {
    if (isOrdered || isUnavailable) return
    if (onOrder) onOrder()// Navigates to order page or open order modal
  }

  return (
    <>
      <article className="property-card">
        {/* Header: User Info */}
        <header className="property-card-header">
          <Link to={`/profile/${ownerId}`} className="property-card-user">
            <img className="property-avatar" src={avatar} alt={`${username}'s profile`} />
            <div className="property-user-info">
              <div className="property-username-row">
                <h4 className="property-username">{username}</h4>
                {isVerified && <AgentBadge />}
                {isPremium && <PremiumBadge />}
              </div>
              <p className="property-handle">{handle} • {time}</p>
            </div>
          </Link>
          <button
            className="property-options-btn"
            onClick={openModal}
            aria-label="More options"
          >
            <BsThreeDots />
          </button>
        </header>

        {/* Image Gallery */}
        <div className="property-images">
          {image.length === 0 ? (
            // Placeholder when no media is uploaded which isn't necessary cause listings can't happen without media upload but just in case.
            // Useful in scenarios like feed loading where media might not be available immediately.
            <div className="property-image-placeholder" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
          ) : image.length > 1 ? (
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              spaceBetween={0}
              slidesPerView={1}
              loop={image.length > 2}   // loop needs more slides than slidesPerView
              className="property-swiper"
            >
              {image.map((media, i) => (
                <SwiperSlide key={i}>
                  {isVideo(media.mimeType) ? (
                    <video
                      src={media.url}
                      className="property-image"
                      controls
                      muted
                      playsInline
                      preload="metadata"  // loads thumbnail frame without downloading full video
                      aria-label={`Property video ${i + 1}`}
                    />
                  ) : (
                    <img
                      src={media.url}
                      alt={`Property view ${i + 1}`}
                      className="property-image"
                    />
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            // Single media item — no swiper needed
            isVideo(image[0].mimeType) ? (
              <video
                src={image[0].url}
                className="property-image property-image-single"
                controls
                muted
                playsInline
                preload="metadata"
                aria-label="Property video"
              />
            ) : (
              <img
                src={image[0].url}
                alt="Property view"
                className="property-image property-image-single"
              />
            )
          )}

          {listingType && (
            <span className="property-listing-type">{listingType}</span>
          )}
        </div>

        {/* Price & Location */}
        <div className="property-details">
          <div className="property-info">
            {(() => {
              const base =
                typeof price === "number"
                  ? price
                  : Number(String(price).replace(/[^\d.]/g, ""))
              const total = (Number.isFinite(base) ? base : 0) + (Number(commission) || 0)
              const formatted = Number.isFinite(total) && total > 0
                ? `₦${total.toLocaleString("en-NG")}`
                : typeof price === "string"
                  ? price
                  : "₦0"
              return <h2 className="property-price">{formatted}{priceLabel}</h2>
            })()}
            <p className="property-location"> 
              <span className="request-chip request-chip--category"><LuBuilding2 /> {category}</span> 
              <span className="request-chip request-chip--category"><GrLocation /> {location} </span>
              {bedrooms && <span className="request-chip request-chip--category"> {bedrooms} </span>}
            </p>
          </div>
          <button
            type="button"
            className={`property-order-btn ${isOrdered || isUnavailable ? 'disabled' : ''}`}
            onClick={handleOrder}
            disabled = {isOrdered || isUnavailable}
          >
            {isUnavailable ? 'Unavailable' : isOrdered ? 'Ordered' : 'Preview'}
          </button>
        </div>

        {/* Activity Bar */}
        <div className="property-activity">
          <div className="property-activity-left">
            <button
              className="property-activity-item"
              onClick={toggleLike}
              aria-label={isLiked ? 'Unlike listing' : 'Like listing'}
              disabled={isLiking}
            >
              {isLiked
                ? <IoMdHeart className="liked" aria-hidden="true" /> 
                : <IoMdHeartEmpty aria-hidden="true" />
              }
              <span>{likeCount}</span>
            </button>
            <button
              className="property-activity-item"
              onClick={openComment}
              aria-label={`${commentCount} comments`}
            >
              <FaRegComment aria-hidden="true" />
              <span>{commentCount}</span>
            </button>
            <button className="property-activity-item" aria-label="Share listing">
              <MdIosShare aria-hidden="true" />
            </button>
          </div>
          <button
            className="property-bookmark-btn"
            onClick={toggleBookmark}
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark listing"}
          >
            {isBookmarked ? (
              <FaBookmark className="bookmarked" />
            ) : (
              <FaRegBookmark />
            )}
          </button>
        </div>

        {/* Description */}
        {description && (
          <p className="property-description">{description}</p>
        )}
      </article>

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        targetId={resolvedPropertyId}
        targetType="property"
      />

      {/* More Options Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} cancel={false}>
        <div className="property-modal-menu">

          {isOwner ? (
            <>
              <button
                className="property-modal-link property-modal-link--danger"
                onClick={handleDelete}
              >
                Delete listing
              </button>
              <button className="property-modal-link" onClick={() => { closeModal() }}>
                Share
              </button>
            </>
          ) : (
            <>
              <button
                className="property-modal-link"
                onClick={() => { closeModal(); setIsReportOpen(true) }}
              >
                Report
              </button>
              <button className="property-modal-link" onClick={() => { toggleBookmark(); closeModal() }}>
                {isBookmarked ? "Remove from favorites" : "Add to favorites"}
              </button>
              <button className="property-modal-link" onClick={closeModal}>
                Share
              </button>
              <Link to={`/profile/${ownerId}`} className="property-modal-link">
                About this account
              </Link>
            </>
          )}

          <button onClick={closeModal} className="property-modal-cancel">
            Cancel
          </button>
        </div>
      </Modal>

      {/* Comments Modal */}
      <Comments 
        isCommentOpen={isComment} 
        onClose={closeComment} 
        propertyId={resolvedPropertyId}
        poster={{
          id: ownerId,
          name: username,
          avatar,
          handle,
          isVerified,
          isPremium,
        }}
        onAddComment={() => setCommentCount((prev) => prev + 1)}
      />
    </>
  )
}
export default PropertyCard
