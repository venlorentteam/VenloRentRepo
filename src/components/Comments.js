import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { SearchBar } from "../exports"
import { FaXmark } from "react-icons/fa6"
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io"
import { AgentBadge, PremiumBadge } from './Badges'
import { timeAgo } from './Time'
import defaultAvatar from "../assets/img/avatar.png"
import { API_BASE } from '../config/api'
import "./Comments.css"

function Comments({
  isCommentOpen,
  onClose,
  comments = [], // Fallback array of comment objects
  onAddComment,
  poster = {}, // Optional poster info: { name, handle, avatar, isVerified, isPremium }
  propertyId,
}) {
  const [likedComments, setLikedComments] = useState(new Set())
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  
  useEffect(() => {
    const fetchComments = async () => {
      try{
        if (!isCommentOpen || !propertyId) return
        setIsLoading(true)
        setError("")
        const token = localStorage.getItem("token")
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        const res = await axios.get(
          `${API_BASE}/properties/${propertyId}/comments`,
          { headers }
        )
        const fetched = res.data.items || []
        setItems(fetched)
        // Seed local like state from backend likedByMe flags.
        setLikedComments(new Set(fetched.filter((c) => c.likedByMe).map((c) => c._id)))
          
      }catch(err){
        setError(err?.response?.data?.message || "Failed to load comments")
      }finally{
        setIsLoading(false)
      } 
    }
    fetchComments()
  }, [isCommentOpen, propertyId])

  const toggleLike = async (commentId) => {
    if (!commentId) return

    const next = !likedComments.has(commentId)
    setLikedComments((prev) => {
      const newSet = new Set(prev)
      next ? newSet.add(commentId) : newSet.delete(commentId)
      return newSet
    })
    // Optimistically update like count in UI.
    setItems((prev) =>
      prev.map((item) =>
        (item._id || item.id) === commentId
          ? { ...item, likeCount: Math.max(0, (item.likeCount || 0) + (next ? 1 : -1)) }
          : item
      )
    )

    const token = localStorage.getItem("token")
    if (!token) return

    try {
      await axios.post(
      `${API_BASE}/comments/${commentId}/like`,
        { liked: next },
        { headers: { Authorization: `Bearer ${token}` } }
      )
    } catch (err) {
      console.error("Failed to like comment:", err)
      // optional: rollback optimistic UI here
    }
  }


  if (!isCommentOpen) return null
  
  const handleAddComment = async (commentText) => {//Add comment to the thread
    try{
      if (!commentText?.trim()) return
      if (onAddComment) onAddComment(commentText)
      if (!propertyId) return
      const token = localStorage.getItem("token")
      if (!token) return

      const res =  await axios.post(`${API_BASE}/properties/${propertyId}/comments`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      //Attach the newly created comment to the top of the list (optimistic update)
      const created = res.data.comment
      if (created) setItems((prev) => [created, ...prev])
      
    }catch(err) {
        console.error("Failed to add comment:", err)
      }
  }

  // Sample comments if none provided
  const displayComments =
    items.length > 0 ? items : comments.length > 0 ? comments : []

  return (
    <>
      {/* Backdrop Overlay */}
      <div className="comments-overlay" onClick={onClose} />

      {/* Comments Modal */}
      <div className="comments-modal">
        {/* Close Button */}
        <button className="comments-close-btn" onClick={onClose} aria-label="Close comments">
          <FaXmark />
        </button>

        {/* Header */}
        <div className="comments-header">
          <h3 className="comments-title">Comments</h3>
          <p className="comments-count">{displayComments.length} comment{displayComments.length !== 1 ? 's' : ''}</p>
        </div>

        {/* Comments List */}
        <div className="comments-list">
          {isLoading ? (
            <p className="comment-time">Loading comments...</p>
          ) : error ? (
            <p className="comment-time">{error}</p>
          ) : displayComments.length === 0 ? (
            // Empty state — controlled message when no comments exist.
            <p className="comment-time">No comments yet. Be the first to comment.</p>
          ) : displayComments.map((item) => (
            <div key={item.id || item._id} className="comment-item">
              <img src={item.author?.avatar || defaultAvatar} 
                alt={`${item.author?.username}'s Avatar`} 
                className="comment-avatar" 
              />

              <div className="comment-content">
                <div className="comment-user-info">
                  <div className="comment-name-row">
                    <span className="comment-name">{item.author?.fullName}</span>
                    {(item.author?.kycStatus === "verified") && (
                      <AgentBadge />
                    )}
                    {(item.author?.plan === "premium" || item.author?.plan === "pro") && (
                      <PremiumBadge />
                    )}
                  </div>
                  <span className="comment-handle">{item.author?.username ? `@${item.author.username}` : ""}</span>
                </div>

                <p className="comment-text">{item.text}</p>

                <div className="comment-actions">
                  <span className="comment-time">{timeAgo(item.createdAt)}</span>
                  <span className="comment-likes">{item.likeCount || 0} likes</span>
                  <button className="comment-reply-btn">Reply</button>
                </div>
              </div>

              <button
                className="comment-like-btn"
                onClick={() => toggleLike(item.id || item._id)}
                aria-label={likedComments.has(item.id || item._id) ? "Unlike comment" : "Like comment"}
              >
                {likedComments.has(item.id || item._id) ? (
                  <IoMdHeart className="liked" />
                ) : (
                  <IoMdHeartEmpty />
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Input Section */}
        <div className="comments-input-section">
          <SearchBar 
            placeholder="Add a comment..."
            mode="message"
            onSearch={handleAddComment}
          />
        </div>
      </div>
    </>
  )
}

export default Comments
