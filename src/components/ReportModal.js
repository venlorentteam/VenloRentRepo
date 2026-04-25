// components/ReportModal.jsx
import React, { useState } from "react"
import axios from "axios"
import { Modal } from "../exports"
import "./ReportModal.css"

const PROPERTY_REASONS = [
  { label: "Fraudulent listing", value: "fraud" },
  { label: "Fake listing", value: "fake_listing" },
  { label: "Spam or duplicate", value: "spam" },
  { label: "Inappropriate content", value: "inappropriate_content" },
  { label: "Harassment", value: "harassment" },
  { label: "Other", value: "other" },
]

const REQUEST_REASONS = [
  { label: "Spam or duplicate", value: "spam" },
  { label: "Fraudulent request", value: "fraud" },
  { label: "Inappropriate content", value: "inappropriate_content" },
  { label: "Harassment", value: "harassment" },
  { label: "Other", value: "other" },
]

function ReportModal({ isOpen, onClose, targetId, targetType = "property" }) {
  const [selectedReason, setSelectedReason] = useState("")
  const [details, setDetails] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const reasons = targetType === "property" ? PROPERTY_REASONS : REQUEST_REASONS
  const endpoint = targetType === "property"
    ? `https://newprojectbackend-5axx.onrender.com/properties/${targetId}/report`
    : `https://newprojectbackend-5axx.onrender.com/requests/${targetId}/report`

  const handleSubmit = async () => {
    if (!selectedReason) {
      setError("Please select a reason")
      return
    }
    const token = localStorage.getItem("token")
    if (!token) return

    setIsSubmitting(true)
    setError("")
    try {
      await axios.post(
        endpoint,
        { reason: selectedReason, details },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setSubmitted(true)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit report. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    // Reset state on close
    setSelectedReason("")
    setDetails("")
    setSubmitted(false)
    setError("")
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} cancel={false}>
      <div className="report-modal">
        {submitted ? (
          // ── Success state ──
          <div className="report-modal-success">
            <div className="report-success-icon">✓</div>
            <h3>Report submitted</h3>
            <p>Thank you for helping keep VenloRent safe. We'll review this shortly.</p>
            <button className="report-btn-close" onClick={handleClose}>Done</button>
          </div>
        ) : (
          <>
            <div className="report-modal-header">
              <h3 className="report-modal-title">Report this {targetType}</h3>
              <p className="report-modal-subtitle">
                Select the reason that best describes the issue
              </p>
            </div>

            {reasons.map(({ label, value }) => (
            <button
                key={value}
                className={`report-reason-btn ${selectedReason === value ? "selected" : ""}`}
                onClick={() => {
                setSelectedReason(value)  // ← sends the enum value to the backend
                setError("")
                }}
            >
                {label}  {/* ← user sees the readable label */}
                {selectedReason === value && <span className="report-reason-check">✓</span>}
            </button>
            ))}

            {selectedReason === "other" && (  // ← was "Other", now matches the enum value
            <div className="report-details-wrapper">
                <textarea
                  className="report-details-input"
                  placeholder="Please describe the issue... (optional)"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  maxLength={300}
                  rows={3}
                />
                <span className="report-char-count">{details.length}/300</span>
            </div>
            )}

            {error && <p className="error-message">{error}</p>}

            <div className="report-modal-actions">
              <button
                className="report-btn-submit"
                onClick={handleSubmit}
                disabled={isSubmitting || !selectedReason}
              >
                {isSubmitting ? "Submitting..." : "Submit report"}
              </button>
              <button className="report-btn-cancel" onClick={handleClose}>
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}

export default ReportModal