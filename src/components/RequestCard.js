import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Modal, ReportModal } from '../exports'
import { AgentBadge, PremiumBadge } from './Badges'
import RequestResponsesModal from './RequestResponsesModal'
import './RequestCard.css'
import { MdIosShare } from "react-icons/md"
import { API_BASE } from '../config/api'

// === Icons — same libraries as PropertyCard.jsx ==================
import { FaBookmark, FaRegBookmark, FaRegComment } from 'react-icons/fa'
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io"
import { BsThreeDots } from 'react-icons/bs'
import { GrLocation } from 'react-icons/gr'
import { TbHomeSearch } from 'react-icons/tb'
import { LuBanknote, LuClock } from 'react-icons/lu'
import { LuBuilding2 } from 'react-icons/lu'

function RequestCard({
  id = '',
  requesterId = '',
  avatar = 'https://i.pravatar.cc/100',
  username = 'Amara Obi',
  handle = '@amaraobi',
  isAgent = true,
  isPremium = false,
  time = '2 hrs ago',
  description = 'Looking for a clean 2-bedroom flat in Wuse 2 or Maitama...',
  category = '',
  location = '',
  budget = '',
  likes = '0',
  likedByMe = null,
  liked = null,
  responseCount = '0',
  agentResponses = [],
  discussionItems = [],
  bookmarked = false,
  requestId = '',
  expired = false,
  daysLeft = null,
  currentUserIsAgent = false,
  onDelete,
}) {
  // == Local state ====================================================
  const [isModalOpen,     setIsModalOpen]     = useState(false)
  const [isResponsesOpen, setIsResponsesOpen] = useState(false)
  const [isBookmarked,    setIsBookmarked]    = useState(bookmarked)

  // Resolve id/liked defaults once so the card can accept either requestId or id.
  const resolvedRequestId = requestId || id
  const initialLiked = likedByMe !== null && likedByMe !== undefined ? likedByMe : !!liked
  const [isLiked, setIsLiked] = useState(initialLiked)
  const [likeCount, setLikeCount] = useState(Number(likes) || 0)
  const [isLiking, setIsLiking] = useState(false)
  const [isReportOpen, setIsReportOpen] = useState(false)
  const [deleteSuccess, setDeleteSuccess] = useState("")
  const [deleteError, setDeleteError] = useState("")
  //const [error, setError] = useState(null)
  

  const currentUserId = (() => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return null
      return JSON.parse(atob(token.split(".")[1]))?.id || null
    } catch (_) {
      return null
    }
  })()
  const isOwner = currentUserId && String(currentUserId) === String(requesterId)

  // Delete handler
  const handleDelete = async () => {
    const confirmed = window.confirm("Delete this request? This cannot be undone.")
    if (!confirmed) return
    const token = localStorage.getItem("token")
    if (!token) return
    try {
      await axios.delete(
        `${API_BASE}/requests/${resolvedRequestId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      closeModal()
      if (onDelete) onDelete(resolvedRequestId)
      setDeleteSuccess("Request deleted successfully.")
    } catch (err) {
      setDeleteError(err.response?.data?.message || "Failed to delete request. Please try again.")
      //alert(err.response?.data?.message || "Failed to delete request.")
    }
  }

  // Report handler
  // const handleReport = async () => {
  //   const token = localStorage.getItem("token")
  //   if (!token) return
  //   try {
  //     await axios.post(
  //       `${API_BASE}/requests/${resolvedRequestId}/report`,
  //       { reason: "Reported by user" },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     )
  //     closeModal()
  //     alert("Report submitted.")
  //   } catch (err) {
  //     console.error("Failed to report:", err)
  //   }
  // }

  // Keep bookmark state in sync when the parent updates.
  useEffect(() => {
    setIsBookmarked(!!bookmarked)
  }, [bookmarked])

  const toggleLike = async () => {
    if (!resolvedRequestId || isLiking) return
    // Auth header is required for the protected like route.
    const token = localStorage.getItem("token")
    if (!token) return
    const next = !isLiked
    // Optimistic UI update
    setIsLiked(next)
    setLikeCount((prev) => Math.max(0, prev + (next ? 1 : -1)))
    setIsLiking(true)
    try {
      await axios.post(
        `${API_BASE}/requests/${resolvedRequestId}/like`,
        { liked: next },
        { headers: { Authorization: `Bearer ${token}` } }
      )
    } catch (err) {
      //setError('Failed to update request like')
      // Rollback if API fails
      setIsLiked(!next)
      setLikeCount((prev) => Math.max(0, prev + (next ? -1 : 1)))
    } finally {
      setIsLiking(false)
    }
  }
  // == Options modal handlers — mirror PropertyCard.jsx exactly ========
  const openOptions = () => setIsModalOpen(true)
  const closeModal = (e) => { e?.preventDefault(); setIsModalOpen(false) }

  // == Responses modal handlers ==========================================
  //const openResponses  = () => { if (!expired) setIsResponsesOpen(true) }
  const openResponses = () => setIsResponsesOpen(true)
  const closeResponses = () => setIsResponsesOpen(false)

  // == Bookmark toggle — mirrors PropertyCard.jsx toggleBookmark =========
  const toggleBookmark = () => {
    const next = !isBookmarked
    setIsBookmarked(next)
    if (!resolvedRequestId) return
    // Auth header is required for the protected bookmark route.
    const token = localStorage.getItem("token")
    if (!token) return
    axios.post(
      `${API_BASE}/requests/${resolvedRequestId}/bookmark`,
      { bookmarked: next },
      { headers: { Authorization: `Bearer ${token}` } }
    ).catch((err) => {
      
    })
  }

  return (
    <>
      <article className={`request-card ${expired ? 'request-card--expired' : ''}`}>

        {/* == ACCENT STRIPE =====
            Cyan-to-green gradient — visually separates RequestCard from
            PropertyCard in a mixed feed.
         */}
        <div className="request-card-stripe" aria-hidden="true" />

        {/* ====== HEADER ===========================================
          Layout classes reused directly from PropertyCard.css
         */}
        <header className="property-card-header">
          <Link to={`/profile/${requesterId || resolvedRequestId}`} className="property-card-user">
            <img
              className="property-avatar"
              src={avatar}
              alt={`${username}'s profile`}
            />
            <div className="property-user-info">
              <div className="property-username-row">
                <h4 className="property-username">{username}</h4>                
                {isAgent && <AgentBadge />}
                {isPremium && <PremiumBadge />}
              </div>
              <p className="property-handle">{handle} · {time}</p>
            </div>
          </Link>

          <div className="request-header-right">
            {/* "Request" type badge — cyan pill, RequestCard.css
                Makes requests stand out at a glance */}
            <span className="request-type-badge">
              <TbHomeSearch aria-hidden="true" />
              Request
            </span>

            {/* Options button — .property-options-btn from PropertyCard.css */}
            <button
              className="property-options-btn"
              onClick={openOptions}
              aria-label="More options"
            >
              <BsThreeDots />
            </button>
          </div>
        </header>

        {/* === BODY =========================================
          .property-description reused from PropertyCard.css —
        */}
        <div className="request-card-body">

          {/* Description — .property-description from PropertyCard.css */}
          <p className="property-description">{description}</p>

          {/* ==== Request Points ================================
            Entirely RequestCard-specific.
          == */}
          {(category || location || budget) && (
            <div className="request-chips">
              {category && (
                <span className="request-chip request-chip--category">
                  <LuBuilding2 aria-hidden="true" />
                  {category}
                </span>
              )}
              {location && (
                <span className="request-chip request-chip--category">
                  <GrLocation aria-hidden="true" />
                  {location}
                </span>
              )}
              {budget && (
                <span className="request-chip request-chip--budget">
                  <LuBanknote aria-hidden="true" />
                  {budget}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Activity Bar - Reused most styles from PropertyCard.css */}
        <div className="property-activity">
          <div className="property-activity-left">

            {/* View count — passive, not tappable
                Rendered as <span> not <button> — no interaction intended.
                .property-activity-item from PropertyCard.css for consistent sizing */}
            <button
              className="property-activity-item"
              onClick={toggleLike}
              aria-label={isLiked ? 'Unlike request' : 'Like request'}
              disabled={isLiking}
            >
              {isLiked
                ? <IoMdHeart className="liked" aria-hidden="true" />
                : <IoMdHeartEmpty aria-hidden="true" />
              }
              <span>{likeCount}</span>
            </button>

            {/* Opens RequestResponsesModal showing both agent offers and the discussion lane*/}
            <button
              className={`property-activity-item request-see-responses
                ${responseCount !== '0' ? 'request-see-responses--has-responses' : ''}
              `}
              onClick={openResponses}
              aria-label={`See ${responseCount} responses`}
            >
              <FaRegComment aria-hidden="true" />
              <span>
                {!expired 
                  ? responseCount === '0'
                    ? 'Add 1st'
                    : `${responseCount}`
                    : null
                }
              </span>
            </button>

            {/* Share — .property-activity-item from PropertyCard.css */}
            <button
              className="property-activity-item"
              aria-label="Share this request"
            >
              <MdIosShare aria-hidden="true" />
            </button>
          </div>

          {/* Right group — bookmark */}
          <div className="request-activity-right">
            {/* Bookmark — .property-bookmark-btn + .bookmarked from PropertyCard.css */}
            <button
              className="property-bookmark-btn"
              onClick={toggleBookmark}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this request'}
            >
              {isBookmarked
                ? <FaBookmark className="bookmarked" />
                : <FaRegBookmark />
              }
            </button>
          </div>
        </div>

        {/* == EXPIRY FOOTER=======================*/}
        <div className="request-expiry">
          <span
            className={`request-expiry-dot ${expired ? 'request-expiry-dot--expired' : ''}`}
            aria-hidden="true"
          />
          {expired
            ? 'Request expired · No longer active'
            : daysLeft !== null
              ? <>
                  <LuClock aria-hidden="true" style={{ fontSize: '11px' }} />
                  {' '}Expires in {daysLeft} day{daysLeft !== 1 ? 's' : ''} · Open request
                </>
              : 'Open request'
          }
        </div>

      </article>
      {/* === REPORT MODAL ========================= */}
      {/* Report Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        targetId={resolvedRequestId}
        targetType="request"
      />
      {/* === OPTIONS MODAL ========================= */}
      <Modal isOpen={isModalOpen} onClose={closeModal} cancel={false}>
        <div className="property-modal-menu">

          {isOwner ? (
            <>
              <button
                className="property-modal-link property-modal-link--danger"
                onClick={handleDelete}
              >
                Delete request
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
              <Link to={`/profile/${requesterId}`} className="property-modal-link">
                About this account
              </Link>
            </>
          )}

          <button onClick={closeModal} className="property-modal-cancel">
            Cancel
          </button>
        </div>
      </Modal>

      {deleteSuccess && <div className="floating-success">{deleteSuccess}</div>}
      {deleteError && <div className="floating-error">{deleteError}</div>}

      <RequestResponsesModal
        isOpen={isResponsesOpen}
        onClose={closeResponses}
        requestId={resolvedRequestId}
        agentResponses={agentResponses}
        discussionItems={discussionItems}
        isExpired={expired}
        currentUserIsAgent={currentUserIsAgent}
        onAddResponse={(data) => {
          if (!resolvedRequestId) return
          // Keep base URL aligned with existing auth endpoints (no /api prefix).
          const token = localStorage.getItem("token")
          axios.post(
            `${API_BASE}/requests/${resolvedRequestId}/agent-responses`,
            data,
            { headers: { Authorization: `Bearer ${token}` } }
          ).catch((err) => {
            
          })
        }}
        onAddComment={(text) => {
          if (!resolvedRequestId) return
          // Keep base URL aligned with existing auth endpoints (no / api prefix).
          const token = localStorage.getItem("token")
          axios.post(
            `${API_BASE}/requests/${resolvedRequestId}/discussions`,
            { text },
            { headers: { Authorization: `Bearer ${token}` } }
          ).catch((err) => {
            
          })
        }}
      />
    </>
  )
}

export default RequestCard
