import React, { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import axios from 'axios'
import { useAuth } from '../context/AuthProvider'
import { API_BASE } from '../config/api'
import "./CreateRequest.css" // Reuse shared stylesheet
import "./CreateList.css"   

// Icon imports (existing pattern) 
import { FaRegEdit } from "react-icons/fa"
import { FaNairaSign, FaAngleRight } from "react-icons/fa6"
import { TfiMenuAlt } from "react-icons/tfi"
import { IoImageOutline } from "react-icons/io5"
import { IoCloudUploadOutline, IoCloseCircle } from "react-icons/io5"
import { GrLocation } from "react-icons/gr"
import { MdOutlineVerified, MdOutlineAccountBalance } from "react-icons/md"
import { TbHomeCheck } from "react-icons/tb"

// CONSTANTS
const CATEGORY_OPTIONS = [
  { value: "apartment", label: "Apartment" },
  { value: "flat", label: "Flat" },
  { value: "self-con", label: "Self-Con" },
  { value: "duplex", label: "Duplex" },
  { value: "shop", label: "Shop" },
  { value: "office", label: "Office" },
  { value: "conference-room", label: "Conference Room" },
]

const LISTING_TYPE_OPTIONS = [
  { value: "rent",     label: "For Rent" },
  { value: "sale",     label: "For Sale" },
  { value: "shortlet", label: "Shortlet" },
]

const BEDROOM_OPTIONS = [
  { value: "studio", label: "Studio" },
  { value: "1", label: "1 Bed" },
  { value: "2", label: "2 Bed" },
  { value: "3", label: "3 Bed" },
  { value: "4+", label: "4+ Bed" },
]

// Nigerian states for location dropdown (abbreviated list — expand as needed)
const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "FCT (Abuja)", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina",
  "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
  "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
]

const PROPERTY_FEATURES = [
  "Parking", "Generator", "Swimming Pool", "Borehole / Water",
  "Security", "WiFi", "Furnished", "Air Conditioning",
  "Elevator", "Gym", "CCTV", "Serviced", "Solar",
]

// MEDIA LIMITS 
const MEDIA_MIN = 1
const MEDIA_MAX = 5
const MEDIA_MAX_BYTES = 5 * 1024 * 1024 // 5 MB per file
const MEDIA_ACCEPTED  = "image/jpeg,image/png,image/webp,video/mp4,video/quicktime"

// INITIAL FORM STATE 
const INITIAL_FORM = {
  title: "",
  description: "",
  listingType: "",   // "rent" | "sale" | "shortlet"
  propertyType: "",   // "apartment" | "flat" | etc.
  bedrooms: "",
  state: "",
  town: "",
  price: "",
  commission: "",
  features: [],   // multi-select array of feature strings
  availability: "available", // "available" | "reserved" | "sold_rented"
  mediaFiles: [],   // Array of File objects (max MEDIA_MAX)
  mediaPreviews: [],   // Array of { url, type } for local preview
}

// === MAIN COMPONENT =======================================
function CreateList() {
  //Get User Data from DB
  const { user } = useAuth()
  // === Form data =========================================
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})

  // === Submission state =======================================
  const [submitting, setSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // null | "success" | "error"
  const [submitMessage, setSubmitMessage] = useState("")

  // === Accordion open/close state =======================================
  const [open, setOpen] = useState({
    category: true,  // open by default so user sees it first
    media: true,
    desc: false,
    location: false,
    price: false,
    features: false,
  })

  const fileInputRef = useRef(null)

  // === Helpers =======================================
  //User status 
  const isVerified = user?.kycStatus === "verified"
  const payoutDetails = user?.payoutDetails || {}
  const hasCompletePayoutDetails = ["bankName", "accountName", "accountNumber", "payoutMethod"].every(
    (field) => payoutDetails?.[field]?.toString().trim()
  )
  const shouldShowPayoutNotice = isVerified && !hasCompletePayoutDetails
  const isSubmitDisabled = submitting || !isVerified || shouldShowPayoutNotice
  // Navigate to KYC
  const navigate = useNavigate()
  const onVerifyClick = () => {
    navigate("/account/verification")
  }
  const onPaymentDetailsClick = () => {
    navigate("/account/payment-details")
  }
  // Toggle a single accordion section
  const toggleSection = (key) =>
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }))

  // Generic field updater
  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    // Clear error on change
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  // Toggle a property feature on/off
  const toggleFeature = (feature) => {
    setForm((prev) => {
      const exists = prev.features.includes(feature)
      return {
        ...prev,
        features: exists
          ? prev.features.filter((f) => f !== feature)
          : [...prev.features, feature],
      }
    })
  }

  // === Media handling =======================================
  const handleMediaChange = (e) => {
    const incoming = Array.from(e.target.files)
    const existing = form.mediaFiles

    // Enforce MEDIA_MAX cap
    const remaining = MEDIA_MAX - existing.length
    if (remaining <= 0) return

    const toAdd = incoming.slice(0, remaining)
    const oversized = toAdd.filter((f) => f.size > MEDIA_MAX_BYTES)

    if (oversized.length > 0) {
      setErrors((prev) => ({
        ...prev,
        media: `Some files exceed 5 MB and were skipped: ${oversized.map((f) => f.name).join(", ")}`,
      }))
    }

    const valid = toAdd.filter((f) => f.size <= MEDIA_MAX_BYTES)
    const newPreviews = valid.map((file) => ({
      url:  URL.createObjectURL(file),
      type: file.type.startsWith("video") ? "video" : "image",
      name: file.name,
    }))

    setForm((prev) => ({
      ...prev,
      mediaFiles:    [...prev.mediaFiles, ...valid],
      mediaPreviews: [...prev.mediaPreviews, ...newPreviews],
    }))

    if (errors.media && oversized.length === 0)
      setErrors((prev) => ({ ...prev, media: "" }))

    // Reset input so same file can be re-added after removal
    e.target.value = ""
  }

  // Remove one media item by index
  const removeMedia = (index) => {
    // Revoke object URL to free memory
    URL.revokeObjectURL(form.mediaPreviews[index].url)

    setForm((prev) => ({
      ...prev,
      mediaFiles:    prev.mediaFiles.filter((_, i) => i !== index),
      mediaPreviews: prev.mediaPreviews.filter((_, i) => i !== index),
    }))
  }

  // === Validation =======================================
  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = "Title is required"
    if (form.title.length > 100) e.title = "Title must be under 100 characters"
    if (!form.listingType) e.listingType = "Select a listing type"
    if (!form.propertyType) e.propertyType = "Select a property type"
    if (!form.state) e.state = "Select a state"
    if (!form.town.trim()) e.address = "Town is required"
    if (!form.price || Number(form.price) <= 0) e.price = "Enter a valid price"
    if (form.commission && isNaN(form.commission)) e.commission = "Commission must be a number"
    if (form.mediaFiles.length < MEDIA_MIN) e.media = `Upload at least ${MEDIA_MIN} photo or video`
    if (!form.description.trim()) e.description = "Add a description"
    if (form.description.length > 1000) e.description = "Description must be under 1000 characters"
    return e
  }

  // === Submit handler =======================================
  const handleSubmit = async (isDraft = false) => {
    if (!isDraft) {
      const validationErrors = validate()
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        // Scroll to first error
        const firstErrField = Object.keys(validationErrors)[0]
        document.getElementById(`field-${firstErrField}`)?.scrollIntoView({
          behavior: "smooth", block: "center",
        })
        return
      }
    }

    setSubmitting(true)
    setSubmitStatus(null)

    try {
      // === Build multipart FormData for BE =================

      const token = localStorage.getItem("token")
      const payload = new FormData()

      payload.append("title", form.title.trim())
      payload.append("description", form.description.trim())
      payload.append("listing_type", form.listingType)
      payload.append("property_type", form.propertyType)
      payload.append("bedrooms", form.bedrooms) 
      payload.append("location[state]", form.state)
      payload.append("location[town]", form.town.trim())
      payload.append("amount", form.price)
      payload.append("commission", form.commission)
      payload.append("features", JSON.stringify(form.features))
      payload.append("status",  isDraft ? "draft" : form.availability)

      // Append each media file under the same key so BE receives an array
      form.mediaFiles.forEach((file) => payload.append("media", file))
 
      await axios.post(`${API_BASE}/create-listing`, payload, {headers: { Authorization: `Bearer ${token}` }})

      // Success
      setSubmitStatus("success")
      setSubmitMessage(
        isDraft
          ? "Draft saved, you can continue editing anytime."
          : "Listing created successfully! It's now live in the feed."
      )
      // Reset form on successful publish
      if (!isDraft) setForm(INITIAL_FORM)

    } catch (err) {
      setSubmitStatus("error")
      setSubmitMessage(err?.response?.data?.message || err?.message || "Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  //=======================================
  // RENDER
  //=======================================

  return (
    <div className="create-list-root">

      {/* ===========================================================
        VERIFICATION GATE
      ================================================================= */}
      {!isVerified && (
        <div className="cl-gate">
          {/* Lock icon + headline */}
          <div className="cl-gate-icon-wrap">
            <MdOutlineVerified className="cl-gate-icon" />
          </div>

          <div className="cl-gate-body">
            <p className="cl-gate-title">Verified Agents Only</p>
            <p className="cl-gate-sub">
              Complete KYC verification to publish property listings on VenloRent
            </p>
          </div>

          <button
            className="cl-gate-cta"
            onClick={onVerifyClick}
          >
            Complete Verification
          </button>
        </div>
      )}

      {shouldShowPayoutNotice && (
        <div className="cl-gate cl-gate--payout">
          <div className="cl-gate-icon-wrap">
            <MdOutlineAccountBalance className="cl-gate-icon" />
          </div>

          <div className="cl-gate-body">
            <p className="cl-gate-title">Payment Details Needed</p>
            <p className="cl-gate-sub">
              Your account is verified, but your payout details are incomplete. Add them to keep your listings payout-ready.
            </p>
          </div>

          <button
            className="cl-gate-cta"
            onClick={onPaymentDetailsClick}
          >
            Update Payment Details
          </button>
        </div>
      )}

      {/*=========================================================
        LISTING FORM
        Rendered for all users but interactions are blocked via
        pointer-events and aria-disabled when !isVerified.
      =============================================================*/}
      <div
        className={`cl-form-wrap ${!isVerified ? "cl-form-wrap--locked" : ""}`}
        aria-disabled={!isVerified}
      >

        {/* === TITLE / CAPTION =======================================*/}
        <div id="field-title" className="post-main-container">
          <div className="caption-input-container">
            <FaRegEdit className="text-icon" />
            <textarea
              name="title"
              className="caption-input"
              placeholder="Add a listing title… (e.g. Spacious 3-Bedroom Flat in Lekki)"
              maxLength={100}
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              disabled={!isVerified}
            />
          </div>
          {/* Character counter */}
          <div className="cl-char-count">
            <span className={form.title.length > 90 ? "cl-char-count--warn" : ""}>
              {form.title.length}/100
            </span>
          </div>
          {errors.title && <p className="error-message">{errors.title}</p>}
        </div>

        <div className="post-features-container">

          {/* === SECTION 1: CATEGORY ================================= */}
          
          <div id="field-listingType" className={`wrapper ${open.category ? "active" : ""}`}>
            <div className="item" onClick={() => toggleSection("category")}>
              <div className="left">
                <TfiMenuAlt className="feature-icon" />
                <p>Category</p>
              </div>
              <FaAngleRight
                className={`feature-icon ${open.category ? "rotate" : ""}`}
              />
            </div>

            {open.category && (
              <div className="empty-container show-feature">
                <div className="content-feature" style={{ textAlign: "left" }}>

                  {/* Listing type */}
                  <p className="cl-chip-group-label">Listing type</p>
                  <div className="label-select-container">
                    {LISTING_TYPE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        className={`label-button ${form.listingType === opt.value ? "selected" : ""}`}
                        onClick={() => setField("listingType", opt.value)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {errors.listingType && (
                    <p className="error-message">{errors.listingType}</p>
                  )}

                  {/* Property type - same accordion, separate chip group */}
                  <p className="cl-chip-group-label" id="field-propertyType">
                    Property type
                  </p>
                  <div className="label-select-container">
                    {CATEGORY_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        className={`label-button ${form.propertyType === opt.value ? "selected" : ""}`}
                        onClick={() => setField("propertyType", opt.value)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {errors.propertyType && (
                    <p className="error-message">{errors.propertyType}</p>
                  )}

                  {/* Bedrooms - logically grouped with category */}
                  <p className="cl-chip-group-label">Bedrooms (Optional)</p>
                  <div className="label-select-container">
                    {BEDROOM_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        className={`label-button ${form.bedrooms === opt.value ? "selected" : ""}`}
                        onClick={() => setField("bedrooms", opt.value)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                </div>
              </div>
            )}
          </div>

          {/* === SECTION 2: MEDIA ===================================== */}
          {/* Media upload.
              Accepts 1–5 files (images or videos).
              Files stored as File objects in form.mediaFiles and previewed
              locally via createObjectURL before submission. */}
          <div
            id="field-media"
            className={`wrapper ${open.media ? "active" : ""}`}
          >
            <div className="item" onClick={() => toggleSection("media")}>
              <div className="left">
                <IoImageOutline className="feature-icon" />
                <p>
                  Add media
                  <span className="cl-field-meta">
                    &nbsp;· {form.mediaFiles.length}/{MEDIA_MAX} added
                  </span>
                </p>
              </div>
              <FaAngleRight
                className={`feature-icon ${open.media ? "rotate" : ""}`}
              />
            </div>

            {open.media && (
              <div className="empty-container show-feature">
                <div className="content-feature">

                  {/* Preview grid - shown once files are added */}
                  {form.mediaPreviews.length > 0 && (
                    <div className="cl-media-grid">
                      {form.mediaPreviews.map((item, idx) => (
                        <div key={idx} className="cl-media-thumb">
                          {item.type === "video" ? (
                            <video
                              src={item.url}
                              className="cl-media-thumb-media"
                              muted
                            />
                          ) : (
                            <img
                              src={item.url}
                              alt={`Preview ${idx + 1}`}
                              className="cl-media-thumb-media"
                            />
                          )}
                          {/* First image badge */}
                          {idx === 0 && (
                            <span className="cl-media-thumb-cover">Cover</span>
                          )}
                          {/* Remove button */}
                          <button
                            className="cl-media-thumb-remove"
                            onClick={() => removeMedia(idx)}
                            aria-label="Remove file"
                          >
                            <IoCloseCircle />
                          </button>
                        </div>
                      ))}

                      {/* Add more slot — only if under cap */}
                      {form.mediaFiles.length < MEDIA_MAX && (
                        <button
                          className="cl-media-add-more"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <IoCloudUploadOutline />
                          <span>Add more</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Empty upload prompt */}
                  {form.mediaPreviews.length === 0 && (
                    <>
                      <IoCloudUploadOutline className="upload-icon" />
                      <h2>Upload photos or videos</h2>
                      <p>
                        {MEDIA_MIN}–{MEDIA_MAX} files · JPG, PNG, MP4 · Max 5 MB each
                      </p>
                      <p className="cl-cover-note">
                        First image will be used as the listing cover photo
                      </p>
                      <button
                        className="label-button cl-upload-btn"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Choose files
                      </button>
                    </>
                  )}

                  {/* Hidden native file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={MEDIA_ACCEPTED}
                    multiple
                    style={{ display: "none" }}
                    onChange={handleMediaChange}
                  />

                  {errors.media && (
                    <p className="error-message" style={{ marginTop: "8px" }}>
                      {errors.media}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* === SECTION 3: DESCRIPTION =========================*/}
          {/* Additional / detailed description (optional accordion).*/}
          <div className={`wrapper ${open.desc ? "active" : ""}`}>
            <div className="item" onClick={() => toggleSection("desc")}>
              <div className="left">
                <FaRegEdit className="feature-icon" />
                <p>Description</p>
              </div>
              <FaAngleRight
                className={`feature-icon ${open.desc ? "rotate" : ""}`}
              />
            </div>

            {open.desc && (
              <div className="empty-container show-feature">
                <div className="content-feature">
                  <div id="field-description">
                    <textarea
                      name="description"
                      style={{ textAlign: "left" }}
                      className="caption-input"
                      placeholder="Describe the property in detail, add every necessary infromation"
                      maxLength={1000}
                      value={form.description}
                      onChange={(e) => setField("description", e.target.value)}
                    />
                    <div className="cl-char-count">
                      <span
                        className={
                          form.description.length > 950 ? "cl-char-count--warn" : ""
                        }
                      >
                        {form.description.length}/1000
                      </span>
                    </div>
                    {errors.description && (
                      <p className="error-message">{errors.description}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* === SECTION 4: LOCATION =============================*/}
          {/* Location: State + Town */}
          <div
            id="field-state"
            className={`wrapper ${open.location ? "active" : ""}`}
          >
            <div className="item" onClick={() => toggleSection("location")}>
              <div className="left">
                <GrLocation className="feature-icon" />
                <p>Location</p>
              </div>
              <FaAngleRight
                className={`feature-icon ${open.location ? "rotate" : ""}`}
              />
            </div>

            {open.location && (
              <div className="empty-container show-feature">
                <div className="content-feature cl-location-grid">

                  {/* State dropdown */}
                  <div className="cl-form-group">
                    <label className="cl-label" htmlFor="ls-state">State</label>
                    <select
                      id="ls-state"
                      className="location-input"
                      value={form.state}
                      onChange={(e) => setField("state", e.target.value)}
                    >
                      <option value="">Select state</option>
                      {NIGERIAN_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="error-message">{errors.state}</p>
                    )}
                  </div>

                  {/* Town — free text (can be swapped to dropdown per state) */}
                  <div className="cl-form-group">
                    <label className="cl-label" htmlFor="ls-town">City / Town</label>
                    <input
                      id="ls-town"
                      type="text"
                      className="location-input"
                      placeholder="e.g. Lekki, Wuse II, GRA"
                      value={form.town}
                      onChange={(e) => setField("town", e.target.value)}
                    />
                  </div>

                </div>
              </div>
            )}
          </div>

          {/* === SECTION 5: PRICE & COMMISSION ======================== */}
          <div
            id="field-price"
            className={`wrapper ${open.price ? "active" : ""}`}
          >
            <div className="item" onClick={() => toggleSection("price")}>
              <div className="left">
                <FaNairaSign className="feature-icon" />
                <p>Price &amp; Commission</p>
              </div>
              <FaAngleRight
                className={`feature-icon ${open.price ? "rotate" : ""}`}
              />
            </div>

            {open.price && (
              <div className="empty-container show-feature">
                <div className="content-feature cl-price-grid">

                  <div className="cl-form-group">
                    <label className="cl-label" htmlFor="ls-price">
                      Listing price (₦) <span className="cl-required">*</span>
                    </label>
                    <div className="cl-input-prefix-wrap">
                      <span className="cl-input-prefix">₦</span>
                      <input
                        id="ls-price"
                        type="number"
                        min="1"
                        className="location-input cl-input-with-prefix"
                        placeholder="0.00"
                        value={form.price}
                        onChange={(e) => setField("price", e.target.value)}
                      />
                    </div>
                    {errors.price && (
                      <p className="error-message">{errors.price}</p>
                    )}
                  </div>

                  <div className="cl-form-group">
                    <label className="cl-label" htmlFor="ls-commission">
                      Commission
                      <span className="cl-optional">&nbsp;(optional)</span>
                    </label>
                    <input
                      id="ls-commission"
                      type="number"
                      className="location-input"
                      placeholder="e.g. 50,000"
                      value={form.commission}
                      onChange={(e) => setField("commission", e.target.value)}
                    />
                    <span className="cl-optional">Agency commission will be added to the listing amount</span>
                    {errors.commission && (
                      <p className="error-message">{errors.commission}</p>
                    )}
                  </div>

                  {/* Availability status — set at creation */}
                  <div className="cl-form-group cl-form-group--full">
                    <label className="cl-label">Availability</label>
                    <div className="label-select-container">
                      {[
                        { value: "available", label: "Available" },
                        { value: "reserved", label: "Reserved" },
                        { value: "sold_rented", label: "Sold / Rented" },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          className={`label-button ${form.availability === opt.value ? "selected" : ""}`}
                          onClick={() => setField("availability", opt.value)}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>

          {/* === SECTION 6: PROPERTY FEATURES ===================================== */}
          {/* Multi-select amenity checkboxes.
              Property features / amenities. Stored as an array of strings. */}
          <div className={`wrapper ${open.features ? "active" : ""}`}>
            <div className="item" onClick={() => toggleSection("features")}>
              <div className="left">
                <TbHomeCheck className="feature-icon" />
                <p>
                  Property features
                  {form.features.length > 0 && (
                    <span className="cl-field-meta">
                      &nbsp;· {form.features.length} selected
                    </span>
                  )}
                </p>
              </div>
              <FaAngleRight
                className={`feature-icon ${open.features ? "rotate" : ""}`}
              />
            </div>

            {open.features && (
              <div className="empty-container show-feature">
                <div className="content-feature">
                  <div className="label-select-container">
                    {PROPERTY_FEATURES.map((feat) => (
                      <button
                        key={feat}
                        className={`label-button ${form.features.includes(feat) ? "selected" : ""}`}
                        onClick={() => toggleFeature(feat)}
                      >
                        {feat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>{/* /post-features-container */}

        {/* === SUBMISSION FEEDBACK ===================================*/}
        {/* Toast-style inline feedback shown after submit attempt */}
        {submitStatus && (
          <div className={submitStatus === "success" ? "submit-success" : "submit-error" }>
            {submitMessage}
          </div>
        )}

        {/* ==== ACTION BUTTONS ======================================= */}
        <div className="cl-actions">
          {/* Save draft: skips full validation, posts with availability="draft" */}
          <button
            className="btn btn-secondary"
            onClick={() => handleSubmit(true)}
            disabled={isSubmitDisabled}
          >
            {submitting ? "Saving…" : "Save draft"}
          </button>

          {/* Publish: full validation before sending */}
          <button
            className={`btn btn-primary ${isSubmitDisabled ? "cl-disabled-btn" : ""}`}
            onClick={() => handleSubmit(false)}
            disabled={isSubmitDisabled}
          >
            {submitting ? "Publishing…" : shouldShowPayoutNotice ? "Complete payout details" : "Publish Listing"}
          </button>
        </div>

      </div>
    </div>
  )
}

export default CreateList
