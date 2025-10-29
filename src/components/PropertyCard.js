import React, { useState } from 'react'
import { Comments, Modal } from '../exports'
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import './PropertyCard.css'
import { FaRegEye, FaRegComment } from 'react-icons/fa'
import { useNavigate, Link } from 'react-router-dom'
import { BsThreeDots } from 'react-icons/bs'
import { GrLocation } from 'react-icons/gr'
import { MdBookmarkBorder, MdIosShare } from 'react-icons/md'

function PropertyCard({
  avatar,
  username = "Obinabo Walter",
  handle = "@walcode",
  time = "1 min ago",
  image = [],
  price = "₦700,000",
  location = "Gwagwalada, Abuja",
  category = "Apartment",
  views = "10k",
  comments = "532",
  //liked = false,
  description = "Self contained apartment, with steady water and light...",
}){
  const [isModalOpen, setIsModalOpen] = useState(false) 
  const [isComment, setIsComment] = useState(false)

  //Control opening and closing of Comment
  const openComment = () => setIsComment(true)
  const closeComment = (e) => {
    e.preventDefault()    
    setIsComment(false)
  }

  //Control opening and closing of Modal
  const openModal = () => setIsModalOpen(true)
  const closeModal = (e) => {
    e.preventDefault()    
    setIsModalOpen(false)
  }
  // const naviagte = useNavigate()

  return (
    <>
      <div className="property-card">
        {/* Card that shows a property. appears on listings page and search results */}
        <div className="top">
          <div className="left">
            <img className="avatar" src={avatar} alt="Profile-pic" />
            <span className="handle">
              <h4>{username}</h4>
              <p>{handle} • {time}</p>
            </span>
          </div>
            <BsThreeDots 
              className="activity-icon"
              onClick={openModal}
            />
        </div>
        <div className="body">
          {image.length > 1 ? (//If imges uploded are greater than 1
              <Swiper
                modules={[Navigation, Pagination]}
                pagination={{ clickable: true }}
                spaceBetween={10}
                slidesPerView={1}
                className="property-swiper"
              >
                {image.map((img, i) => (
                  <SwiperSlide key={i}>
                    <img src={img} alt={`Property ${i + 1}`} />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (//If just one image is uploaded
            <img
              src={image[0]}
              alt="Property"
              className="single-image"
            />
          )}
          {/* <img src={image} alt="Property-pic" /> */}
        </div>
        <div className="bottom">{/** Conatiner for location and order button **/}
          <div className="left">
            <h2>{price}</h2>
            <p className="location"><span className="location-icon"><GrLocation /></span> {location}  •  {category}</p>
          </div>
          <button type="button" className="order-button" onClick="">Order</button>
        </div>
        <div className="activity">{/** Conatiner for activity clicks like share, comment etc **/}
          <div className="left">
            <div className="item"><FaRegEye /> <p>{views}</p></div>
            <div className="item" onClick={openComment}><FaRegComment className="activity-icon" /> <p>{comments}</p></div>
            <div className="item"><MdIosShare className="activity-icon" /></div>
          </div>
          <MdBookmarkBorder className="activity-icon"/>
        </div>
        <p>{description}</p>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal} cancel={false}>
        <div className="modal-link">
          <p><Link to="">Report</Link></p>
          <p><Link to="">Add to favorites</Link></p>
          <p><Link to="">Share</Link></p>
          <p><Link to="">About this account</Link></p>
          <p><Link onClick={closeModal}>cancel</Link></p>
        </div>
      </Modal>
      <Comments isCommentOpen={isComment} onClose={closeComment}/>
    </>
  )
}

export default PropertyCard
