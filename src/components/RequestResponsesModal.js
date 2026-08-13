import { useState, useEffect } from 'react'
import axios from 'axios'
import { SearchBar, Modal } from '../exports'
import { AgentBadge, PremiumBadge } from './Badges'
import { FaXmark } from 'react-icons/fa6'
import { IoMdHeartEmpty, IoMdHeart } from 'react-icons/io'
import { GrLocation } from 'react-icons/gr'
import { FiHome } from 'react-icons/fi'
import { useNavigate} from 'react-router-dom'
import defaultAvatar from "../assets/img/avatar.png"
import { timeAgo } from './Time'
import './RequestResponsesModal.css'
import { API_BASE } from '../config/api'

// ====================================================================
//  LISTING CHIP
//  Renders the attached property snapshot inside an agent response.
// ====================================================================

function ListingChip({ snapshot, onOpen }) {
  if (!snapshot?.price) return null

  return (
    <button className="rrm-listing-chip" onClick={() => onOpen?.(snapshot)}>
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
        <span className="rrm-listing-loc">{snapshot.title}</span>
        <span className="rrm-listing-loc">
          <GrLocation aria-hidden="true" />
          {snapshot.location}
        </span>
      </div>
      <span className="rrm-listing-arrow" aria-hidden="true">›</span>
    </button>
  )
}

// ====================================================================
//  LISTING PICKER MODAL
//  Shown when agent clicks the attach button.
// ====================================================================
function ListingPickerModal({ isOpen, onClose, listings, isLoading, selectedId, onSelect }) {
  if (!isOpen) return null
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="rrm-picker-modal">
        {/* Header */}
        <div className="rrm-picker-header">
          <h4 className="rrm-picker-title">Attach a Listing</h4>
          <button
            className="comments-close-btn"
            onClick={onClose}
            aria-label="Close listing picker"
          >
            <FaXmark />
          </button>
        </div>

        {/* Body */}
        <div className="rrm-picker-body">
          {isLoading ? (
            <p className="comment-time rrm-picker-empty">Loading your listings…</p>
          ) : listings.length === 0 ? (
            <p className="comment-time rrm-picker-empty">
              You have no active listings to attach.
            </p>
          ) : (
            <ul className="rrm-picker-list">
              {listings.map((listing) => {
                const isSelected = listing.id === selectedId
                return (
                  <li key={listing.id}>
                    <button
                      className={`rrm-picker-item ${isSelected ? 'rrm-picker-item--selected' : ''}`}
                      onClick={() => {
                        onSelect(isSelected ? null : listing) // toggle off if already selected
                        onClose()
                      }}
                    >
                      {/* Thumbnail */}
                      {listing.image ? (
                        <img
                          src={listing.image}
                          alt={listing.title}
                          className="rrm-picker-thumb"
                          loading="lazy"
                        />
                      ) : (
                        <div className="rrm-picker-thumb rrm-picker-thumb--placeholder">
                          <FiHome aria-hidden="true" />
                        </div>
                      )}

                      {/* Info */}
                      <div className="rrm-picker-info">
                        <span className="rrm-listing-price">{listing.price}</span>
                        <span className="rrm-listing-loc">
                          <GrLocation aria-hidden="true" />
                          {listing.location || 'Location not set'}
                        </span>
                        <span className="rrm-picker-item-title">{listing.title}</span>
                      </div>

                      {/* Selection indicator */}
                      {isSelected && (
                        <span className="rrm-picker-check" aria-label="Selected">✓</span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </Modal>
  )
}

function AgentResponseItem({ item }) {
  const navigate = useNavigate() 
  
  // == Handle listing chip open (navigate to listing details) ==
  const openListing = (snapshot) => {
    if (snapshot?.listingId) {
      navigate(`/listing/${snapshot.listingId}/order`)
    }
  }
  return (
    <div className="rrm-agent-reply">
      <img
        src={item.avatar || defaultAvatar }
        alt={`${item.name}'s avatar`}
        className="comment-avatar rrm-agent-avatar"
      />
      <div className="rrm-agent-content">
        <div className="comment-name-row">
          <span className="comment-name">{item.name}</span>
          <AgentBadge className="rrm-badge rrm-badge--agent"/>
          {item.isPremium && <PremiumBadge className="rrm-badge rrm-badge--premium"/>}
        </div>
        <span className="comment-handle">{item.handle}</span>
        <p className="comment-text rrm-reply-text">{item.text}</p>
        <ListingChip snapshot={item.listingSnapshot} onOpen={openListing} />
        <div className="comment-actions">
          <span className="comment-time">{timeAgo(item.time)}</span>
        </div>
      </div>
    </div>
  )
}

// =====================================================================
//  DISCUSSION ITEM
// =====================================================================
function DiscussionItem({ item, isLiked, onToggleLike }) {
  return (
    <div className="comment-item">
      <img
        src={item.avatar || defaultAvatar}
        alt={`${item.name}'s avatar`}
        className="comment-avatar"
      />
      <div className="comment-content">
        <div className="comment-user-info">
          <div className="comment-name-row">
            <span className="comment-name">{item.name}</span>
            {item.isAgent && <AgentBadge />}
            {item.isPremium && <PremiumBadge />}
          </div>
          <span className="comment-handle">{item.handle}</span>
        </div>
        <p className="comment-text">{item.comment}</p>
        <div className="comment-actions">
          <span className="comment-time">{timeAgo(item.time)}</span>
          <span className="comment-likes">{item.likeCount} likes</span>
          <button className="comment-reply-btn">Reply</button>
        </div>
      </div>
      <button
        className="comment-like-btn"
        onClick={() => onToggleLike(item.id)}
        aria-label={isLiked ? 'Unlike' : 'Like'}
      >
        {isLiked ? <IoMdHeart className="liked" /> : <IoMdHeartEmpty />}
      </button>
    </div>
  )
}

// ========================================
//  MAIN COMPONENT — RequestResponsesModal
// ========================================
function RequestResponsesModal({
  isOpen,
  onClose,
  agentResponses  = [],
  discussionItems = [],
  onAddResponse,
  onAddComment,
  requestId,
  isExpired = false,
  currentUserIsAgent  = false,
}) {
  const [activeTab, setActiveTab] = useState('agents')
  const [responses, setResponses] = useState([])
  const [discussion, setDiscussion] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Listing attachment state
  const [isAttachOpen, setIsAttachOpen] = useState(false)
  const [listingOptions, setListingOptions] = useState([])
  const [isListingLoading, setIsListingLoading] = useState(false)
  const [selectedListing, setSelectedListing] = useState(null)

  // Liked discussion comments
  const [likedItems, setLikedItems] = useState(new Set())

  // == Fetch responses & discussion when modal opens =============
  useEffect(() => {
    const fetchData = async () => {
      if (!isOpen || !requestId) return
      setIsLoading(true)
      setError("")
      try {
        const token = localStorage.getItem("token")
        const headers = token ? { Authorization: `Bearer ${token}` } : {}

        const [resResponses, resComments] = await Promise.all([
          axios.get(`${API_BASE}/requests/${requestId}/agent-responses`, { headers }),
          axios.get(`${API_BASE}/requests/${requestId}/discussions`, { headers }),
        ])

        const mappedResponses = (resResponses.data.items || []).map((r) => ({
          id: r._id,
          avatar: r.author?.avatar,
          name: r.author?.fullName || r.author?.username,
          handle: r.author?.username ? `@${r.author.username}` : "",
          isPremium: r.author?.plan === "premium",
          text: r.text,
          listingSnapshot: r.listingSnapshot,
          time: r.createdAt,
        }))

        const mappedDiscussion = (resComments.data.items || []).map((d) => ({
          id: d._id,
          avatar: d.author?.avatar,
          name: d.author?.fullName || d.author?.username,
          handle: d.author?.username ? `@${d.author.username}` : "",
          isAgent: d.author?.role === "agent" || d.author?.kycStatus === "verified",
          isPremium: d.author?.plan === "premium",
          comment: d.text,
          likeCount: d.likeCount || 0,
          likedByMe: !!d.likedByMe,
          time: d.createdAt,
        }))

        setResponses(mappedResponses)
        setDiscussion(mappedDiscussion)
        setLikedItems(new Set(mappedDiscussion.filter((d) => d.likedByMe).map((d) => d.id)))
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load responses")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [isOpen, requestId])

  // === Fetch agent's own listings when picker opens ======================
  useEffect(() => {
    const myListing = async () => {
      if (!isAttachOpen) return
      const token = localStorage.getItem("token")
      if (!token) return
      setIsListingLoading(true)

      try{
        const res = await axios.get(`${API_BASE}/my-listings`, {
          headers: { Authorization: `Bearer ${token}` }
        })
          
        const items = res.data.items || []
        const mapped = items.map((p) => ({
          id: p._id,
          title: p.title || "Listing",
          price: `₦${Number(p.amount || 0).toLocaleString("en-NG")}`,
          location: [p.location?.town, p.location?.state].filter(Boolean).join(", "),
          image: (p.media || [])
            .map((m) => (typeof m === "string" ? m : m?.url))
            .filter(Boolean)[0],
        }))
        setListingOptions(mapped)
      }catch(err) {
        console.error("Failed to load listings:", err)
        setListingOptions([])
      }finally{
        setIsListingLoading(false)
      }
    }
    myListing()
  }, [isAttachOpen])

  // === Like / unlike ====
  const toggleLike = async (itemId) => {
    if (!itemId) return
    const nextLiked = !likedItems.has(itemId)
    setLikedItems((prev) => {
      const next = new Set(prev)
      next.has(itemId) ? next.delete(itemId) : next.add(itemId)
      return next
    })
    setDiscussion((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, likeCount: Math.max(0, (item.likeCount || 0) + (nextLiked ? 1 : -1)) }
          : item
      )
    )
    const token = localStorage.getItem("token")
    if (!token) return
    try {
      await axios.post(
        `${API_BASE}/discussions/${itemId}/like`,
        { liked: nextLiked },
        { headers: { Authorization: `Bearer ${token}` } }
      )
    } catch (err) {
      console.error("Failed to like discussion:", err)
    }
  }

  // === Submit agent response ==========
  const handleAddResponse = async (text) => {
    if (!text?.trim()) return

    if (requestId) {
      const token = localStorage.getItem("token")
      if (!token) return
      try {
        const res = await axios.post(
          `${API_BASE}/requests/${requestId}/agent-responses`,
          {
            text,
            listingSnapshot: selectedListing
              ? {
                  listingId: selectedListing.id,
                  price: selectedListing.price,
                  location: selectedListing.location,
                  image: selectedListing.image,
                  title: selectedListing.title,
                }
              : undefined,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        const created = res.data.response
        if (created) {
          const mapped = {
            id: created._id,
            avatar: created.author?.avatar,
            name: created.author?.fullName || created.author?.username,
            handle: created.author?.username ? `@${created.author.username}` : "",
            isPremium: created.author?.plan === "premium",
            text: created.text,
            listingSnapshot: created.listingSnapshot,
            time: created.createdAt,
          }
          setResponses((prev) => [mapped, ...prev])
          setSelectedListing(null) // clear after posting
        }
      } catch (err) {
        console.error("Failed to add response:", err)
      }
      return
    }
    onAddResponse?.({ text })
  }

  // === Submit discussion comment ======================
  const handleAddComment = async (text) => {
    if (!text?.trim()) return

    if (requestId) {
      const token = localStorage.getItem("token")
      if (!token) return
      try {
        const res = await axios.post(
          `${API_BASE}/requests/${requestId}/discussions`,
          { text },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        const created = res.data.comment
        if (created) {
          const mapped = {
            id: created._id,
            avatar: created.author?.avatar,
            name: created.author?.fullName || created.author?.username,
            handle: created.author?.username ? `@${created.author.username}` : "",
            isAgent: created.author?.role === "agent" || created.author?.kycStatus === "verified",
            isPremium: created.author?.plan === "premium",
            comment: created.text,
            likeCount: created.likeCount || 0,
            time: created.createdAt,
          }
          setDiscussion((prev) => [mapped, ...prev])
        }
      } catch (err) {
        console.error("Failed to add discussion comment:", err)
      }
      return
    }
    onAddComment?.(text)
  }

  if (!isOpen) return null

  const displayResponses  = responses.length  > 0 ? responses  : agentResponses
  const displayDiscussion = discussion.length > 0 ? discussion : discussionItems

  return (
    <>
      <div className="comments-overlay" onClick={onClose} />
      <div className="comments-modal rrm-modal">

        {/* Close button */}
        <button
          className="comments-close-btn"
          onClick={onClose}
          aria-label="Close responses"
        >
          <FaXmark />
        </button>

        {/* Header + tab bar */}
        <div className="comments-header">
          <h3 className="comments-title">Responses</h3>

          <div className="rrm-tab-bar" role="tablist">
            <button
              role="tab"
              aria-selected={activeTab === 'agents'}
              className={`rrm-tab ${activeTab === 'agents' ? 'rrm-tab--active' : ''}`}
              onClick={() => setActiveTab('agents')}
            >
              <AgentBadge className="rrm-tab-icon" aria-hidden="true" />
              Agent Offers
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

        {/* === AGENT OFFERS TAB === */}
        {activeTab === 'agents' && (
          <>
            <div className="comments-list">
              {isLoading ? (
                <p className="comment-time">Loading responses…</p>
              ) : error ? (
                <p className="comment-time">{error}</p>
              ) : displayResponses.length === 0 ? (
                <p className="comment-time">No responses yet. Be the first agent to drop a response.</p>
              ) : displayResponses.map((item) => (
                <AgentResponseItem key={item.id} item={item} />
              ))}
            </div>

            <div className="comments-input-section rrm-agent-footer">
              {isExpired ? (
                <p className="rrm-footer-note rrm-footer-note--expired">
                  This request has expired. New agent offers can no longer be submitted.
                </p>
              ) : currentUserIsAgent ? (
                <>
                  <p className="rrm-footer-note">
                    <AgentBadge className="rrm-badge rrm-badge--agent" /> Only verified agents can post offers
                  </p>

                  {/* Selected listing preview — shows which listing will be attached */}
                  {selectedListing && (
                    <div className="rrm-selected-listing-preview">
                      {selectedListing.image && (
                        <img
                          src={selectedListing.image}
                          alt={selectedListing.title}
                          className="rrm-listing-thumb"
                          loading="lazy"
                        />
                      )}
                      <div className="rrm-listing-info">
                        <span className="rrm-listing-price">{selectedListing.price}</span>
                        <span className="rrm-listing-loc">
                          <GrLocation aria-hidden="true" />
                          {selectedListing.location}
                        </span>
                      </div>
                      {/* Clear the selection */}
                      <button
                        className="rrm-deselect-btn"
                        aria-label="Remove attached listing"
                        onClick={() => setSelectedListing(null)}
                      >
                        <FaXmark />
                      </button>
                    </div>
                  )}

                  <div className="rrm-agent-input-row">
                    <SearchBar
                      placeholder="Describe what you have…"
                      mode="message"
                      onSearch={handleAddResponse}
                    />
                    <button
                      className={`rrm-attach-btn ${selectedListing ? 'rrm-attach-btn--active' : ''}`}
                      aria-label="Attach a listing"
                      title={selectedListing ? 'Change attached listing' : 'Attach one of your listings'}
                      onClick={() => setIsAttachOpen(true)}
                    >
                      <FiHome aria-hidden="true" />
                    </button>
                  </div>
                </>
              ) : (
                <p className="rrm-footer-note rrm-footer-note--readonly">
                  <AgentBadge className="rrm-badge rrm-badge--agent" /> Agent offers are posted by KYC verified agents only
                </p>
              )}
            </div>
          </>
        )}

        {/* === DISCUSSION TAB === */}
        {activeTab === 'discussion' && (
          <>
            <div className="rrm-discussion-note">
              Open discussion, tips, questions, and experiences from the community
            </div>

            <div className="comments-list">
              {isLoading ? (
                <p className="comment-time">Loading discussion…</p>
              ) : error ? (
                <p className="comment-time">{error}</p>
              ) : displayDiscussion.length === 0 ? (
                <p className="comment-time">No discussion yet. Be the first to start a conversation.</p>
              ) : displayDiscussion.map((item) => (
                <DiscussionItem
                  key={item.id}
                  item={item}
                  isLiked={likedItems.has(item.id)}
                  onToggleLike={toggleLike}
                />
              ))}
            </div>

            <div className="comments-input-section">
              {isExpired ? (
                <p className="rrm-footer-note rrm-footer-note--expired">
                  This request has expired. Discussion is now read-only.
                </p>
              ) : (
                <SearchBar
                  placeholder="Add to the discussion…"
                  mode="message"
                  onSearch={handleAddComment}
                />
              )}
            </div>
          </>
        )}
      </div>

      {/* === LISTING PICKER MODAL =============================================
           Rendered OUTSIDE the main modal div so it stacks on top cleanly.
      === */}
      <ListingPickerModal
        isOpen={isAttachOpen}
        onClose={() => setIsAttachOpen(false)}
        listings={listingOptions}
        isLoading={isListingLoading}
        selectedId={selectedListing?.id}
        onSelect={setSelectedListing}
      />
    </>
  )
}

export default RequestResponsesModal