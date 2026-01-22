import React, { useEffect } from 'react'
import './Modal.css'
import { FaXmark } from "react-icons/fa6"

function Modal({ children, isOpen, onClose, cancel = true, title }) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop Overlay */}
      <div className="modal-overlay" onClick={onClose} />

      {/* Modal Container */}
      <div 
        className="modal-container" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        {/* Close Button */}
        {cancel && (
          <button 
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="Close modal"
          >
            <FaXmark />
          </button>
        )}

        {/* Optional Title */}
        {title && (
          <h2 id="modal-title" className="modal-title">{title}</h2>
        )}

        {/* Modal Content */}
        <div className="modal-content">
          {children}
        </div>
      </div>
    </>
  )
}

export default Modal