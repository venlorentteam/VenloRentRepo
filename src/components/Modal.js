import React, { useState } from 'react'
import './Modal.css'
import { FaXmark } from "react-icons/fa6"

function Modal({children, isOpen, onClose, cancel=true}){
  if(!isOpen) return null
  // const [modal, setModal] = useState()
  // const toggleModal = ()=>{
  //   setModal(modal => !modal)
  // }
  return (
    <>
      <div className="overlay" onClick={onClose}></div>
      <div className="modal" onClick={(e) => e.stopPropagation()}>{/*Prevent closing modal on click of the modal itself*/}
        {cancel && <span className="cancel" onClick={onClose}><FaXmark /></span>}
        {children}
      </div>
    </>
  )
}

export default Modal  
