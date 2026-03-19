import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { Modal } from '../exports'
import { AgentBadge, PremiumBadge } from './Badges'
import RequestResponsesModal from './RequestResponsesModal'
import './RequestCard.css'
import { MdIosShare } from "react-icons/md"

// === Icons — same libraries as PropertyCard.jsx ==================
import { FaBookmark, FaRegBookmark, FaRegComment } from 'react-icons/fa'
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io"
import { BsThreeDots } from 'react-icons/bs'
import { GrLocation } from 'react-icons/gr'
import { TbHomeSearch } from 'react-icons/tb'
import { LuBanknote, LuClock } from 'react-icons/lu'

import { RiVerifiedBadgeFill } from 'react-icons/ri'

// ===========================================================
//  MAIN COMPONENT
//
//  Props:
//    avatar             string   — poster's avatar URL
//    username           string   — poster's display name
//    handle             string   — poster's @handle
//    isAgent            boolean  — poster completed KYC → shows AgentBadge
//    isPremium          boolean  — poster on paid plan → shows PremiumBadge
//    time               string   — relative post time e.g. "2 hrs ago"
//    description        string   — the request body text
//    category           string   — optional, from CreateRequest category field
//    location           string   — optional, from CreateRequest location field
//    budget             string   — optional, from CreateRequest budget field
//    Likes              string   — Like count, rendered as "0" if not provided for consistent UI
//    responseCount      string   — total agent + discussion responses (drives tab counts)
//    agentResponses     array    — passed directly into RequestResponsesModal
//    discussionItems    array    — passed directly into RequestResponsesModal
//    bookmarked         boolean  — initial bookmark state
//    requestId          string   — request id for respond and API routes
//    expired            boolean  — true when 30-day window has passed
//    daysLeft           number   — countdown shown in expiry footer; null = no countdown
//    currentUserIsAgent boolean  — controls agent compose footer inside modal
//    onRespond          fn       — agent CTA handler (opens respond flow)
// ─────────────────────────────────────────────────────────────────────────────
function RequestCard({
  avatar             = 'https://i.pravatar.cc/100',
  username           = 'Amara Obi',
  handle             = '@amaraobi',
  isAgent            = true,
  isPremium          = false,
  time               = '2 hrs ago',
  description        = 'Looking for a clean 2-bedroom flat in Wuse 2 or Maitama...',
  category           = '',
  location           = '',
  budget             = '',
  likes              = '0',
  responseCount      = '0',
  agentResponses     = [],
  discussionItems    = [],
  bookmarked         = false,
  requestId          = '',
  expired            = false,
  daysLeft           = null,
  currentUserIsAgent = false,
}) {
  const navigate = useNavigate()
  // == Local state ====================================================
  const [isOptionsOpen,   setIsOptionsOpen]   = useState(false)
  const [isResponsesOpen, setIsResponsesOpen] = useState(false)
  const [isBookmarked,    setIsBookmarked]    = useState(bookmarked)
  const [isLiked, setIsLiked] = useState(false)

  const toggleLike = () => {
    setIsLiked(p => !p)
    // TODO: POST /listings/:id/like
  }
  // == Options modal handlers — mirror PropertyCard.jsx exactly ========
  const openOptions  = () => setIsOptionsOpen(true)
  const closeOptions = (e) => { e?.preventDefault(); setIsOptionsOpen(false) }

  // == Responses modal handlers ==========================================
  //const openResponses  = () => { if (!expired) setIsResponsesOpen(true) }
  const openResponses = () => setIsResponsesOpen(true)
  const closeResponses = () => setIsResponsesOpen(false)

  // == Bookmark toggle — mirrors PropertyCard.jsx toggleBookmark =========
  const toggleBookmark = () => {
    const next = !isBookmarked
    setIsBookmarked(next)
    if (!requestId) return
    axios.post(`/api/requests/${requestId}/bookmark`, { bookmarked: next }).catch((err) => {
      console.error('Failed to update request bookmark:', err)
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
          <div className="property-card-user">
            <img
              className="property-avatar"
              src={avatar}
              alt={`${username}'s profile`}
            />
            <div className="property-user-info">
              <div className="property-username-row">
                <h4 className="property-username">{username}</h4>

                {/* Agent badge — KYC verified only */}
                {isAgent && <AgentBadge />}

                {/* Premium badge — paid plan, independent of agent status */}
                {isPremium && <PremiumBadge />}
              </div>
              <p className="property-handle">{handle} · {time}</p>
            </div>
          </div>

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
              category, location → green chip  (property type, mirrors primary theme)
              budget → grey chip   (neutral)
              → .request-chips, .request-chip--* (RequestCard.css)
          ── */}
          {(category || location || budget) && (
            <div className="request-chips">
              {category && (
                <span className="request-chip request-chip--category">
                  <TbHomeSearch aria-hidden="true" />
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

        {/* ── ACTIVITY BAR ─────────────────────────────────────────────────
            Layout classes reused from PropertyCard.css
        ── */}
        <div className="property-activity">
          <div className="property-activity-left">

            {/* View count — passive, not tappable
                Rendered as <span> not <button> — no interaction intended.
                .property-activity-item from PropertyCard.css for consistent sizing */}
            <span
              className="property-activity-item"
              onClick={toggleLike}
              aria-label={isLiked ? 'Unlike request' : 'Like request'}
            >
              {isLiked
                ? <IoMdHeart className="liked" aria-hidden="true" />
                : <IoMdHeartEmpty aria-hidden="true" />
              }
              <span>{likes}</span>
            </span>

            {/* 
              Opens RequestResponsesModal showing both agent offers
              and the discussion lane, so any user with the same
              housing need can browse what agents have offered.
              Base layout: .property-activity-item (PropertyCard.css)
              Accent state: .request-see-responses (RequestCard.css) */}
            <button
              className={`property-activity-item request-see-responses
                ${responseCount !== '0' ? 'request-see-responses--has-responses' : ''}
              `}
              onClick={openResponses}
              aria-label={`See ${responseCount} responses`}
            >
              <FaRegComment aria-hidden="true" />
              <span>
                {currentUserIsAgent && !expired
                  ? responseCount === '0'
                    ? 'Be the first to respond'
                    : `Respond · ${responseCount} responses`
                  : responseCount === '0'
                    ? 'No responses yet'
                    : `See Responses (${responseCount})`
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

          {/* Right group — bookmark + respond */}
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

        {/* ── EXPIRY FOOTER ─────────────────────────────────────────────────
            No equivalent in PropertyCard — entirely RequestCard-specific.
            Communicates the 30-day request lifespan from the PRD.
            
            NOTE: Reactivation feature is planned for a later sprint.
            When built, the reactivate CTA will be injected here.
        ── */}
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

      {/* ── OPTIONS MODAL ────────────────────────────────────────────────────
          Modal menu for the ··· button.
          All classes reused from PropertyCard.css:
            .property-modal-menu    — flex col container
            .property-modal-link    — individual action link
            .property-modal-cancel  — cancel button, bordered top
      ── */}
      <Modal isOpen={isOptionsOpen} onClose={closeOptions} cancel={false}>
        <div className="property-modal-menu">
          <Link to="#" className="property-modal-link">Report</Link>
          <Link to="#" className="property-modal-link">
            {isBookmarked ? 'Remove from saved' : 'Save request'}
          </Link>
          <Link to="#" className="property-modal-link">Share</Link>
          <Link to="#" className="property-modal-link">About this account</Link>
          <button onClick={closeOptions} className="property-modal-cancel">
            Cancel
          </button>
        </div>
      </Modal>

      {/* ── RESPONSES MODAL ──────────────────────────────────────────────────
          Two-lane thread: Agent Offers + Discussion.
          agentResponses and discussionItems are fetched by the parent
          and passed straight through — RequestCard doesn't own that data.
          currentUserIsAgent gates the agent compose footer inside the modal.
          isExpired disables both input footers when the request has closed.
      ── */}
      <RequestResponsesModal
        isOpen={isResponsesOpen}
        onClose={closeResponses}
        agentResponses={agentResponses}
        discussionItems={discussionItems}
        isExpired={expired}
        currentUserIsAgent={currentUserIsAgent}
        onAddResponse={(data) => {
          if (!requestId) return
          axios.post(`/api/requests/${requestId}/agent-responses`, data).catch((err) => {
            console.error('Failed to submit agent response:', err)
          })
        }}
        onAddComment={(text) => {
          if (!requestId) return
          axios.post(`/api/requests/${requestId}/comments`, { text }).catch((err) => {
            console.error('Failed to submit discussion comment:', err)
          })
        }}
      />
    </>
  )
}

export default RequestCard
