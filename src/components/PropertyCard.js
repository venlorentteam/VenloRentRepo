import React, { useState } from 'react'
import { Comments, Modal } from '../exports'
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
import { MdIosShare } from 'react-icons/md'

function PropertyCard({
  avatar = "https://i.pravatar.cc/100",
  username = "Jay carlos",
  handle = "@jaycarlx",
  verified = true,
  time = "1 min ago",
  image = [],
  price = "₦700,000",
  location = "Gwagwalada, Abuja",
  category = "Apartment",
  likes = "0",
  comments = "532",
  bookmarked = false,
  description = "Self contained apartment, with steady water and light...",
  onOrder,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isComment, setIsComment] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(bookmarked)
  const [isLiked, setIsLiked] = useState(false)

  const toggleLike = () => {
    setIsLiked(p => !p)
    // TODO: POST /api/listings/:id/like
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
    setIsBookmarked(!isBookmarked)
    // TODO: Add API call to save bookmark
  }

  const handleOrder = () => {
    if (onOrder) onOrder()
    // TODO: Navigate to order page or open order modal
  }

  return (
    <>
      <article className="property-card">
        {/* Header: User Info */}
        <header className="property-card-header">
          <div className="property-card-user">
            <img className="property-avatar" src={avatar} alt={`${username}'s profile`} />
            <div className="property-user-info">
              <div className="property-username-row">
                <h4 className="property-username">{username}</h4>
                {verified && (
                  <AgentBadge />
                )}
              </div>
              <p className="property-handle">{handle} • {time}</p>
            </div>
          </div>
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
          {image.length > 1 ? (
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              spaceBetween={0}
              slidesPerView={1}
              className="property-swiper"
              loop
            >
              {image.map((img, i) => (
                <SwiperSlide key={i}>
                  <img src={img} alt={`Property view ${i + 1}`} className="property-image" />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <img
              src={image[0]}
              alt="Property view"
              className="property-image property-image-single"
            />
          )}
        </div>

        {/* Price & Location */}
        <div className="property-details">
          <div className="property-info">
            <h2 className="property-price">{price}</h2>
            <p className="property-location">
              <GrLocation className="location-icon" aria-hidden="true" />
              <span>{location} • {category}</span>
            </p>
          </div>
          <button
            type="button"
            className="property-order-btn"
            onClick={handleOrder}
          >
            Order
          </button>
        </div>

        {/* Activity Bar */}
        <div className="property-activity">
          <div className="property-activity-left">
            <button
              className="property-activity-item"
              onClick={toggleLike}
              aria-label={isLiked ? 'Unlike listing' : 'Like listing'}
            >
              {isLiked
                ? <IoMdHeart className="liked" aria-hidden="true" /> 
                : <IoMdHeartEmpty aria-hidden="true" />
              }
              <span>{likes}</span>
            </button>
            <button
              className="property-activity-item"
              onClick={openComment}
              aria-label={`${comments} comments`}
            >
              <FaRegComment aria-hidden="true" />
              <span>{comments}</span>
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

      {/* More Options Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} cancel={false}>
        <div className="property-modal-menu">
          <Link to="#" className="property-modal-link">Report</Link>
          <Link to="#" className="property-modal-link">
            {isBookmarked ? "Remove from favorites" : "Add to favorites"}
          </Link>
          <Link to="#" className="property-modal-link">Share</Link>
          <Link to="#" className="property-modal-link">About this account</Link>
          <button onClick={closeModal} className="property-modal-cancel">
            Cancel
          </button>
        </div>
      </Modal>

      {/* Comments Modal */}
      <Comments isCommentOpen={isComment} onClose={closeComment} />
    </>
  )
}
export default PropertyCard