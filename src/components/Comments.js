import React from 'react'
import { MessageInputBar } from "../exports"
import { FaXmark } from "react-icons/fa6"
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import "./Comments.css"
function Comments({
  isCommentOpen,
  onClose,
  avatar,
  handle = "walcode",
  comment="Pretty good, just finishing some code 😄",
  likeCount = 115,
  time = "10h"
}){
  if(!isCommentOpen) return null
  return (
    <>
      <div className="comment-overlay" onClick={onClose}></div>
      <div className="comment">
        {<span className="cancel" onClick={onClose}><FaXmark /></span>}
        {/* comments section for posts. seen on feed */}
        <div className="display-comments">
          <div className="main-comment">{/*Actual comment container to map*/}
            <div className='left'>
              <img src={avatar} alt="Profile" className="avatar" />
              <div className="center">
                <span className='handle'>{handle}</span>
                <p className="message">{comment}</p>
                <div className="activity">
                  <span className="activity-link">{time}</span>
                  <span className="activity-link">{likeCount} likes</span>
                  <span className="activity-link">Reply</span>
                </div>
              </div>
            </div>
            <span className='right'><IoMdHeartEmpty /> </span>

          </div>
        </div>
        <div className="comment-input">
          <MessageInputBar placeholder="Add comment..."/>
        </div>
      </div>
    </>
    
  )
}
export default Comments
