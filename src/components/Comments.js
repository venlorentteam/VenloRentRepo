import React, { useState } from 'react'
import { SearchBar } from "../exports"
import { FaXmark } from "react-icons/fa6"
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io"
import { AgentBadge, PremiumBadge } from './Badges'
import "./Comments.css"

function Comments({
  isCommentOpen,
  onClose,
  comments = [], // Array of comment objects
  onAddComment,
}) {
  const [likedComments, setLikedComments] = useState(new Set())

  if (!isCommentOpen) return null

  const toggleLike = (commentId) => {
    setLikedComments((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(commentId)) {
        newSet.delete(commentId)
      } else {
        newSet.add(commentId)
      }
      return newSet
    })
  }

  const handleAddComment = (commentText) => {
    if (onAddComment) {
      onAddComment(commentText)
    }
  }

  // Sample comments if none provided
  const displayComments = comments.length > 0 ? comments : [
    {
      id: 1,
      avatar: "https://i.pravatar.cc/100?img=1",
      handle: "@walcode",
      name: "Walter Code",
      verified: true,
      comment: "Pretty good, just finishing some code 😄",
      likeCount: 115,
      time: "10h",
    },
  ]

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
          {displayComments.map((item) => (
            <div key={item.id} className="comment-item">
              <img 
                src={item.avatar} 
                alt={`${item.name}'s avatar`} 
                className="comment-avatar" 
              />

              <div className="comment-content">
                <div className="comment-user-info">
                  <div className="comment-name-row">
                    <span className="comment-name">{item.name}</span>
                    {item.verified && (
                      <AgentBadge className="comment-verified" />
                    )}
                  </div>
                  <span className="comment-handle">{item.handle}</span>
                </div>

                <p className="comment-text">{item.comment}</p>

                <div className="comment-actions">
                  <span className="comment-time">{item.time}</span>
                  <span className="comment-likes">{item.likeCount} likes</span>
                  <button className="comment-reply-btn">Reply</button>
                </div>
              </div>

              <button
                className="comment-like-btn"
                onClick={() => toggleLike(item.id)}
                aria-label={likedComments.has(item.id) ? "Unlike comment" : "Like comment"}
              >
                {likedComments.has(item.id) ? (
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