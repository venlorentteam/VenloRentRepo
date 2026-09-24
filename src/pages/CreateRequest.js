import React, { useState } from 'react'
import axios from 'axios'
import { API_BASE } from '../config/api'
import "./CreateRequest.css";
import { FaRegEdit } from "react-icons/fa"
import { FaNairaSign, FaAngleRight } from "react-icons/fa6"
import { TfiMenuAlt } from "react-icons/tfi"
import { GrLocation } from "react-icons/gr"

function CreateRequest() {
    const [category, setCategory] = useState(true)
    const [location, setLocation] = useState(false)
    const [amount, setAmount] = useState(false)

    // Request form state (mirrors structured location from CreateList).
    const [form, setForm] = useState({
      description: "",
      category: "",
      state: "",
      town: "",
      address: "",
      budget: "",
    })
    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState("")

    const openCategory = () => {
      setCategory(prev => !prev)
    }

    const openLocation = () => {
      setLocation(prev => !prev)
    }
    const openAmount = () => {
      setAmount(prev => !prev)
    }

    // Options data
    const categoryOptions = [
      { value: 'apartment', label: 'Apartment' },
      { value: 'flat', label: 'Flat' },
      { value: 'self-contained', label: 'Self-Contained' },
      { value: 'duplex', label: 'Duplex' },
      { value: 'shop', label: 'Shop' },
      { value: 'office', label: 'Office' },
      { value: 'conference-room', label: 'Conference Room' },
      { value: 'studio', label: 'Studio' },
  
    ]

    // Nigerian states list (shared with CreateList for consistency).
    const NIGERIAN_STATES = [
      "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
      "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
      "FCT (Abuja)", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina",
      "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
      "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
    ]
  
    // Handler for single selection (Categories)
    const handleSelectCategory = (value) => {
      setForm((prev) => ({ ...prev, category: value }))
      if (errors.category) setErrors((prev) => ({ ...prev, category: "" }))
    }

    const setField = (field, value) => {
      setForm((prev) => ({ ...prev, [field]: value }))
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
    }

    const validate = () => {
      const e = {}
      if (!form.description.trim()) e.description = "Description is required"
      return e
    }

    const handleSubmit = async () => {
      const validationErrors = validate()
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        return
      }

      setSubmitting(true)
      try {
        // Auth header is required for the protected request creation route.
        const token = localStorage.getItem("token")
        if (!token) return
        //create request payload
        const payload = {
          description: form.description.trim(),
          category: form.category,
          location: {
            state: form.state,
            town: form.town.trim(),
          },
          budget: form.budget.trim(),
        }
        await axios.post(
          `${API_BASE}/create-request`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        )
          setSubmitSuccess("Request created successfully!")
          // Clear the form after a successful post.
          setForm({
            description: "",
            category: "",
            state: "",
            town: "",
            budget: "",
          })        
      } catch (err) {
        setErrors((prev) => ({
          ...prev,
          submit: err?.response?.data?.message || "Failed to create request",
        }))
      } finally {
        setSubmitting(false)
      }
    }
  return (
    <> 
      <div className="post-main-container">
        <div className="caption-input-container">
          <FaRegEdit className="text-icon"/>
          <textarea
            type="text"
            name="description"
            maxLength={200}
            placeholder="Post a request of what you're looking for..."
            className="caption-input"
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
          />
        </div>
        {/* Character counter */}
        <div className="cl-char-count">
          <span className={form.description.length > 190 ? "cl-char-count--warn" : ""}>{/*cl-char-count--warn taken from CreateList.css*/}
            {form.description.length}/200
          </span>
        </div>
        {errors.description && <p className="error-message">{errors.description}</p>}
      </div>
      {/* <hr /> */}
      <div className="post-features-container">
        {/* Category selection */}
        <div className={`wrapper ${category ? "active" : ""}`}>
          <div className="item" onClick={openCategory}> {/*Property List category selector*/}
            <div className="left">
              <TfiMenuAlt className="feature-icon"/>
              <p>Category (optional)</p>
            </div>
            <FaAngleRight className={`feature-icon ${category ? "rotate" : ""}`}/>
          </div>
          <div className={`empty-container ${category ? "show-feature" : ""}`}>
            <div className="content-feature">
              <div className="label-select-container">
                {categoryOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSelectCategory(option.value)}
                    className={`label-button ${form.category === option.value ? 'selected' : ''}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
     
        {/* Location input */}
        <div className={`wrapper ${location ? "active" : ""}`}>
          <div className="item" onClick={openLocation}>
            <div className="left">
              <GrLocation className="feature-icon"/>
              <p>Location </p>
            </div>
            <FaAngleRight className={`feature-icon ${location ? "rotate" : ""}`}/>
          </div>
          <div className={`empty-container ${location ? "show-feature" : ""}`}>
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
        </div>

        {/* Amount Input */}
        <div className={`wrapper ${amount ? "active" : ""}`}>
          <div className="item" onClick={openAmount}>
            <div className="left">
              <FaNairaSign className="feature-icon"/>
              <p>Add budget (optional)</p>
            </div>
            <FaAngleRight className={`feature-icon ${amount ? "rotate" : ""}`}/>
          </div>
          <div className={`empty-container ${amount ? "show-feature" : ""}`}>
            <div className="content-feature">
              <input
                type="text"
                name="amount"
                className="location-input"
                placeholder="e.g. 600k - 900k/yr"
                value={form.budget}
                onChange={(e) => setField("budget", e.target.value)}
              />
            </div>
          </div>
        </div>
        {errors.submit && <div className="submit-error">{errors.submit}</div>}
        {submitSuccess && <div className="submit-success">{submitSuccess}</div>}
      </div>
        
      <div className="cl-actions">
        <button
          className="btn btn-primary cl-btn-publish"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Posting…" : "Post Request"}
        </button>
      </div>
    </> 
  )
}

export default CreateRequest
