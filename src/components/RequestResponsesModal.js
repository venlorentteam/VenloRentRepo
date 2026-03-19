import React, { useState } from 'react'
import { SearchBar } from '../exports'
import { AgentBadge, PremiumBadge } from './Badges'
import { FaXmark } from 'react-icons/fa6'
import { IoMdHeartEmpty, IoMdHeart } from 'react-icons/io'
import { GrLocation } from 'react-icons/gr'
import { FiHome } from 'react-icons/fi'
import './RequestResponsesModal.css'

// ====================================================================
//  LISTING CHIP
//
//  Renders the attached property snapshot inside an agent response.
//  Uses listingSnapshot (frozen at write time on the backend) so the
//  card still renders correctly even if the agent later deletes the
//  actual listing from the platform.
//
//  Returns null if the agent responded with text only (no attachment).
// ======================================================================
function ListingChip({ snapshot }) {
  // Agent responded without attaching a listing — render nothing
  if (!snapshot?.price) return null

  return (
    <div className="rrm-listing-chip">
      {snapshot.image && (
        <img
          src={snapshot.image}
          alt="Attached property"
          className="rrm-listing-thumb"
          loading="lazy"
        />
      )}
      <div className="rrm-listing-info">
        <span className="rrm-listing-price">{snapshot.price}</span>
        <span className="rrm-listing-loc">
          <GrLocation aria-hidden="true" />
          {snapshot.location}
        </span>
      </div>
      {/* Visual affordance that the chip is tappable */}
      <span className="rrm-listing-arrow" aria-hidden="true">›</span>
    </div>
  )
}

// ===========================================================================
//  AGENT RESPONSE ITEM
//
//  Renders one entry in the Agent Offers lane.
//  Avatar | content (name row + text + meta) | (no like btn — not applicable)
//
//  Every item in this lane is by definition from a KYC agent, so
//  AgentBadge always renders. PremiumBadge renders only if isPremium === true.
// ===========================================================================
function AgentResponseItem({ item }) {
  return (
    <div className="rrm-agent-reply">

      {/* Agent Avatar */}
      <img
        src={item.avatar}
        alt={`${item.name}'s avatar`}
        className="comment-avatar rrm-agent-avatar"  /* reuse comment-avatar base, add agent border */
      />

      <div className="rrm-agent-content">
        {/* Name row */}
        <div className="comment-name-row">
          <span className="comment-name">{item.name}</span>   {/* reuse comment-name */}
          {/* Agent badge always present — this lane is agents-only */}
          <AgentBadge className="rrm-badge rrm-badge--agent"/>
          {/* Premium badge only if this agent is on a paid plan */}
          {item.isPremium && <PremiumBadge className="rrm-badge rrm-badge--premium"/>}
        </div>

        {/* Handle */}
        <span className="comment-handle">{item.handle}</span>

        {/* Response text — mirrors comment-text from Comments.jsx */}
        <p className="comment-text rrm-reply-text">{item.text}</p>

        {/* Optional listing card — absent if agent replied with text only */}
        <ListingChip snapshot={item.listingSnapshot} />

        {/* Time — mirrors comment-time from Comments.jsx */}
        <div className="comment-actions">
          <span className="comment-time">{item.time}</span>
        </div>
      </div>
    </div>
  )
}

// =====================================================================
//  DISCUSSION ITEM
//
//  Renders one comment in the Discussion lane.
//  This is structurally IDENTICAL to the comment-item in Comments.jsx.
//  The only addition is PremiumBadge — Comments.jsx only checks `verified`
//  (which in the old PRD meant email-verified). Here `isAgent` drives the
//  agent badge and `isPremium` drives the premium badge independently.
//  ====================================================================
function DiscussionItem({ item, isLiked, onToggleLike }) {
  return (
    /* comment-item — directly from Comments.jsx, same class name */
    <div className="comment-item">

      {/* comment-avatar — directly from Comments.jsx */}
      <img
        src={item.avatar}
        alt={`${item.name}'s avatar`}
        className="comment-avatar"
      />

      {/* comment-content — directly from Comments.jsx */}
      <div className="comment-content">
        <div className="comment-user-info">

          {/* comment-name-row — directly from Comments.jsx */}
          <div className="comment-name-row">
            <span className="comment-name">{item.name}</span>

            {/* Agent badge — only if this commenter is a KYC agent.
                Replaces the old `item.verified` check from Comments.jsx
                since "verified" now exclusively means KYC agent. */}
            {item.isAgent && <AgentBadge />}

            {/* Premium badge — independent of agent status */}
            {item.isPremium && <PremiumBadge />}
          </div>

          {/* comment-handle — directly from Comments.jsx */}
          <span className="comment-handle">{item.handle}</span>
        </div>

        {/* comment-text — directly from Comments.jsx */}
        <p className="comment-text">{item.comment}</p>

        {/* comment-actions — directly from Comments.jsx */}
        <div className="comment-actions">
          <span className="comment-time">{item.time}</span>
          <span className="comment-likes">{item.likeCount} likes</span>
          <button className="comment-reply-btn">Reply</button>
        </div>
      </div>

      {/* comment-like-btn — directly from Comments.jsx, same logic */}
      <button
        className="comment-like-btn"
        onClick={() => onToggleLike(item.id)}
        aria-label={isLiked ? 'Unlike' : 'Like'}
      >
        {isLiked
          ? <IoMdHeart className="liked" /> /* liked class from Comments.css */
          : <IoMdHeartEmpty />
        }
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  SAMPLE DATA
//  Used when no real data is passed in — mirrors Comments.jsx fallback pattern.
// ─────────────────────────────────────────────────────────────────────────────
const sampleAgentResponses = [
  {
    id: 1,
    avatar:    'https://i.pravatar.cc/100?img=12',
    name:      'Emeka Realty',
    handle:    '@emekarealty',
    isPremium: true,
    text:      'I have a 2-bed ground floor flat in Wuse 2. Fitted kitchen, 24hr security, borehole. Available immediately.',
    listingSnapshot: {
      price:    '₦800,000/yr',
      location: 'Wuse 2, Abuja',
      image:    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=120&q=80',
    },
    time: '45 min ago',
  },
  {
    id: 2,
    avatar:    'https://i.pravatar.cc/100?img=33',
    name:      'Grace Homes',
    handle:    '@gracehomes',
    isPremium: false,
    text:      'Maitama option — 1st floor flat, solar backup + borehole. ₦750k/yr, negotiable for a good tenant.',
    listingSnapshot: {
      price:    '₦750,000/yr',
      location: 'Maitama, Abuja',
      image:    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=120&q=80',
    },
    time: '1 hr ago',
  },
  {
    id: 3,
    avatar:    'https://i.pravatar.cc/100?img=55',
    name:      'Crown Realtors',
    handle:    '@crownrealtors',
    isPremium: false,
    // No listingSnapshot — agent replied with text only, listing chip won't render
    text:      'I have 2 units in Wuse 2 — ground floor ₦650k and 1st floor ₦620k. Both have EKEDC meter. Can show you this weekend.',
    time: '2 hrs ago',
  },
]

const sampleDiscussion = [
  {
    id: 1,
    avatar:    'https://i.pravatar.cc/100?img=7',
    name:      'Tunde Balogun',
    handle:    '@tundeb',
    isAgent:   false,
    isPremium: false,
    comment:   'Emeka Realty is solid — they helped me find my place in Wuse 2 last year. Very straightforward.',
    likeCount: 12,
    time:      '30 min ago',
  },
  {
    id: 2,
    avatar:    'https://i.pravatar.cc/100?img=18',
    name:      'Chioma Nwachukwu',
    handle:    '@chiomaN',
    isAgent:   false,
    isPremium: true,
    comment:   'Also looking for something similar in that area! Would love to know what you end up finding 👀',
    likeCount: 4,
    time:      '1 hr ago',
  },
  {
    id: 3,
    avatar:    'https://i.pravatar.cc/100?img=29',
    name:      'Yusuf Musa',
    handle:    '@yusufm',
    isAgent:   false,
    isPremium: false,
    comment:   'Avoid Wuse 2 near the junction — road floods badly in rainy season. Central Wuse 2 is fine though.',
    likeCount: 31,
    time:      '2 hrs ago',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
//  MAIN COMPONENT — RequestResponsesModal
//
//  Props:
//    isOpen            boolean  — controls visibility
//    onClose           fn       — close handler
//    agentResponses    array    — agent offer objects (AgentResponseItem shape)
//    discussionItems   array    — comment objects (DiscussionItem shape)
//    onAddResponse     fn       — called when agent submits an offer
//    onAddComment      fn       — called when any user submits a discussion comment
//    isExpired         boolean  — when true, both input footers are hidden
//    currentUserIsAgent boolean — controls whether agent footer renders
//
//  Shell structure is identical to Comments.jsx:
//    overlay → modal → close btn → header → [scrollable body] → input section
// ─────────────────────────────────────────────────────────────────────────────
function RequestResponsesModal({
  isOpen,
  onClose,
  agentResponses  = [],
  discussionItems = [],
  onAddResponse,
  onAddComment,
  isExpired           = false,
  currentUserIsAgent  = false,
}) {
  // Active tab — 'agents' or 'discussion'
  const [activeTab, setActiveTab] = useState('agents')

  // Liked discussion comments 
  const [likedItems, setLikedItems] = useState(new Set())

  // Mirrors Comments.jsx early return pattern exactly
  if (!isOpen) return null

  const toggleLike = (itemId) => {
    setLikedItems(prev => {
      const next = new Set(prev)
      next.has(itemId) ? next.delete(itemId) : next.add(itemId)
      return next
    })
  }

  // Fall back to sample data when no real data passed in — mirrors Comments.jsx
  const displayResponses  = agentResponses.length  > 0 ? agentResponses  : sampleAgentResponses
  const displayDiscussion = discussionItems.length > 0 ? discussionItems : sampleDiscussion

  return (
    <>
      {/* ── OVERLAY — identical to Comments.jsx overlay ── */}
      <div className="comments-overlay" onClick={onClose} />   {/* reuse comments-overlay */}

      {/* ── MODAL SHELL — mirrors comments-modal from Comments.jsx exactly ── */}
      <div className="comments-modal rrm-modal">  {/* reuse comments-modal + add rrm-modal for tab overrides */}

        {/* Close button — identical to Comments.jsx */}
        <button
          className="comments-close-btn" 
          onClick={onClose}
          aria-label="Close responses"
        >{/* reuse comments-close-btn */}
          <FaXmark />
        </button>

        {/* ── HEADER — mirrors comments-header structure ── */}
        <div className="comments-header">   {/* reuse comments-header */}
          <h3 className="comments-title">Responses</h3>  {/* reuse comments-title */}

          {/* ── TAB BAR — replaces comments-count with two tabs ── */}
          <div className="rrm-tab-bar" role="tablist">

            <button
              role="tab"
              aria-selected={activeTab === 'agents'}
              className={`rrm-tab ${activeTab === 'agents' ? 'rrm-tab--active' : ''}`}
              onClick={() => setActiveTab('agents')}
            >
              <AgentBadge className="rrm-tab-icon" aria-hidden="true" />
              Agent Offers
              {/* Count badge — tells user how many agent offers exist before switching */}
              <span className="rrm-tab-count rrm-tab-count--agent">
                {displayResponses.length}
              </span>
            </button>

            <button
              role="tab"
              aria-selected={activeTab === 'discussion'}
              className={`rrm-tab ${activeTab === 'discussion' ? 'rrm-tab--active' : ''}`}
              onClick={() => setActiveTab('discussion')}
            >
              Discussion
              <span className="rrm-tab-count rrm-tab-count--discussion">
                {displayDiscussion.length}
              </span>
            </button>

          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            LANE 1 — AGENT OFFERS
            Only visible when activeTab === 'agents'
        ══════════════════════════════════════════════════════ */}
        {activeTab === 'agents' && (
          <>
            {/* Scrollable list — mirrors comments-list from Comments.jsx */}
            <div className="comments-list">                    {/* reuse comments-list */}
              {displayResponses.map(item => (
                <AgentResponseItem key={item.id} item={item} />
              ))}
            </div>

            {/* ── AGENT OFFER FOOTER ──────────────────────────────
                input-section from Comments.jsx.

                Three states:
                  1. isExpired → show expired notice, no input
                  2. currentUserIsAgent → show compose input
                  3. regular user → show read-only note
            ─────────────────────────────────────────────────── */}
            <div className="comments-input-section rrm-agent-footer">  {/* reuse comments-input-section */}
              {isExpired ? (
                /* State 1 — request is expired, no new responses accepted */
                <p className="rrm-footer-note rrm-footer-note--expired">
                  This request has expired. New agent offers can no longer be submitted.
                </p>
              ) : currentUserIsAgent ? (
                /* State 2 — current user is a KYC agent, show compose row */
                <>
                  <p className="rrm-footer-note">
                    <AgentBadge className="rrm-badge rrm-badge--agent" /> Only verified agents can post offers
                  </p>
                  {/* SearchBar reused from Comments.jsx input pattern */}
                  <div className="rrm-agent-input-row">
                    <SearchBar
                      placeholder="Describe what you have..."
                      mode="message"
                      onSearch={(text) => onAddResponse?.({ text })}
                    />
                    {/* Attach listing button — TODO: open listing picker modal */}
                    <button
                      className="rrm-attach-btn"
                      aria-label="Attach a listing"
                      title="Attach one of your listings"
                    >
                      <FiHome aria-hidden="true" />
                    </button>
                  </div>
                </>
              ) : (
                /* State 3 — regular user, read-only */
                <p className="rrm-footer-note rrm-footer-note--readonly">
                  <AgentBadge className="rrm-badge rrm-badge--agent" /> Agent offers are posted by KYC verified agents only
                </p>
              )}
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════
            LANE 2 — DISCUSSION
            Only visible when activeTab === 'discussion'
            Structurally identical to Comments.jsx body + footer.
        ══════════════════════════════════════════════════════ */}
        {activeTab === 'discussion' && (
          <>
            {/* Context note — sits above the comments list */}
            <div className="rrm-discussion-note">
              Open discussion — tips, questions, and experiences from the community
            </div>

            {/* Scrollable list — reuses comments-list and all comment-* classes */}
            <div className="comments-list">
              {displayDiscussion.map(item => (
                <DiscussionItem
                  key={item.id}
                  item={item}
                  isLiked={likedItems.has(item.id)}
                  onToggleLike={toggleLike}
                />
              ))}
            </div>

            {/* ── DISCUSSION FOOTER ───────────────────────────────
                Input-section from Comments.jsx exactly.
                All users can comment — no role gate here.
                Only blocked when request is expired.
            ─────────────────────────────────────────────────── */}
            <div className="comments-input-section">           {/* reuse comments-input-section */}
              {isExpired ? (
                <p className="rrm-footer-note rrm-footer-note--expired">
                  This request has expired. Discussion is now read-only.
                </p>
              ) : (
                /* SearchBar — identical usage to Comments.jsx */
                <SearchBar
                  placeholder="Add to the discussion..."
                  mode="message"
                  onSearch={(text) => onAddComment?.(text)}
                />
              )}
            </div>
          </>
        )}

      </div>
    </>
  )
}

export default RequestResponsesModal