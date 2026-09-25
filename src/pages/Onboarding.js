import React, { useState, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Onboarding.css'
import { ClickButton } from '../exports'
import venlorentLogo from '../assets/img/venlorent-light.png'
import { FiHome, FiCompass, FiMapPin, FiCheckCircle, FiArrowLeft } from 'react-icons/fi'
import { MdVerifiedUser } from 'react-icons/md'
import { useAuth } from "../context/AuthProvider"
import { API_BASE } from '../config/api'
import axios from 'axios'

import onboardingIllustration from '../assets/img/Venlorent-iii.png'

// This is a search preference, not an account role. Account roles are set at
// registration and enforced by the authenticated user returned by the backend.
const SEARCH_INTENTS = [
  { id: "searching", label: "I'm looking for a place", icon: FiHome, description: "Browse verified listings and message agents." },
  { id: "exploring", label: "Just exploring", icon: FiCompass, description: "See how VenloRent works before deciding." },
]

const CITIES = ["Lagos", "Abuja", "Port Harcourt", "Awka", "Ibadan", "Enugu", "Asaba", "Uyo", "Kaduna"]
const CATEGORIES = ["Rent", "Sale", "Shortlet"]
//const HOUSE_TYPES = ["Self-Contained", "1 Bedroom", "2 Bedroom", "3 Bedroom", "4+ Bedroom", "Duplex", "Bungalow", "Apartment", "Shop", "Office", "Conference Room"]
const PROPERTY_TYPE = ["Apartment", "Flat", "Self-Contained", "Duplex", "Shop", "Office", "Conference-Room", "Studio"]
const MOVE_IN_OPTIONS = ["As soon as possible", "Within a month", "Just browsing for now"]
const BEDROOM_OPTIONS = ["1", "2", "3", "4+"]

function Onboarding() {
  const navigate = useNavigate()
  const [stepIndex, setStepIndex] = useState(0)
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    searchIntent: "",
    locations: [],
    otherLocation: "",
    category: "",
    propertyTypes: [],   // renamed from houseTypes
    bedrooms: [],
    moveIn: "",
  })

  const { state: navigationState } = useLocation()
  const { user, updateUser } = useAuth()

  const accountRole = user?.role ?? navigationState?.role ?? "regular"
  const isAgentAccount = accountRole === "agent"

  const submitOnboarding = async (payload) => {
    setError(null)

    try {
      const token = localStorage.getItem("token")

      const res = await axios.patch(
        `${API_BASE}/onboarding`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (!res.data?.success || !res.data?.user) {
        throw new Error(res.data?.message || "Could not save your preferences.")
      }

      updateUser(res.data.user)
      return true
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Could not save your preferences.")
      return false
    }
  }

  // Registration determines the flow. Regular users choose a search intent;
  // agents go directly to listing questions and the KYC explainer.
  const steps = useMemo(() => {
    const flow = isAgentAccount
      ? ["locations", "preferences", "verify"]
      : ["intent", "locations", "preferences"]
    flow.push("complete")
    return flow
  }, [isAgentAccount])

  const currentStep = steps[stepIndex]
  const isLastDataStep = stepIndex === steps.length - 2
  const toggleLocation = (city) => {
    setFormData((prev) => ({
      ...prev,
      locations: prev.locations.includes(city)
        ? prev.locations.filter((c) => c !== city)
        : [...prev.locations, city],
    }))
  }

  const togglePropertyType = (type) => {
    setFormData((prev) => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(type)
        ? prev.propertyTypes.filter((t) => t !== type)
        : [...prev.propertyTypes, type],
    }))
  }

  const toggleBedroom = (count) => {
    setFormData((prev) => ({
      ...prev,
      bedrooms: prev.bedrooms.includes(count)
        ? prev.bedrooms.filter((c) => c !== count)
        : [...prev.bedrooms, count],
    }))
  }

  const canProceed = () => {
    switch (currentStep) {
      case "intent":
        return !!formData.searchIntent
      case "locations":
        return formData.locations.length > 0 || formData.otherLocation.trim() !== ""
      case "preferences":
        return Boolean(
          formData.category &&
          formData.propertyTypes.length > 0 &&
          (isAgentAccount || formData.searchIntent === "exploring" || formData.moveIn)
        )
      default:
        return true
    }
  }

  const handleNext = async () => {
    if (!canProceed()) return

    if (isLastDataStep) {
      setIsSubmitting(true)

      const saved = await submitOnboarding({
        onboarding: {
          searchIntent: formData.searchIntent,
          locations: formData.locations,
          otherLocation: formData.otherLocation.trim(),
          category: formData.category.toLowerCase(),
          propertyTypes: formData.propertyTypes.map((t) => t.toLowerCase()),
          bedrooms: formData.bedrooms.map((b) => b.toLowerCase()),
          moveIn: formData.moveIn,
          skipped: false,
        },
      })

      setIsSubmitting(false)

      if (!saved) return
    }

    setStepIndex((index) => Math.min(index + 1, steps.length - 1))
  }

  // Steps are derived from the authenticated account role, so decrementing the
  // current index reliably returns to the preceding step in either flow.
  const handleBack = () => {
    setStepIndex((index) => Math.max(index - 1, 0))
  }

  const handleSkip = async () => {
    setIsSubmitting(true)

    const saved = await submitOnboarding({
      onboarding: { skipped: true },
    })

    setIsSubmitting(false)

    if (!saved) return

    navigate(
      isAgentAccount ? "/kyc" : "/dashboard",
      { replace: true }
    )
  }

  const handleFinish = () => {
    navigate(
      isAgentAccount ? "/kyc" : "/dashboard",
      { replace: true }
    )
  }

  const dataSteps = steps.filter((s) => s !== "complete")
  const progressIndex = dataSteps.indexOf(currentStep)

  return (
    <div className="onboarding-page">
      <div className="onboarding-shell">
        <div className="onboarding-layout">
          <aside className="onboarding-visual-panel">
            <div className="onboarding-visual-card">
              <img src={onboardingIllustration} alt="Modern apartment interior" className="onboarding-visual-image" />
              <div className="onboarding-visual-badge onboarding-badge-top">Verified homes</div>
              <div className="onboarding-visual-badge onboarding-badge-bottom">Find homes with confidence.</div>
            </div>
          </aside>

          <div className="onboarding-card">
            <div className="onboarding-brand-wrap">
              <img src={venlorentLogo} alt="VenloRent logo" className="onboarding-brand-logo" />
            </div>

            {/* Progress + Skip */}
            {currentStep !== "complete" && (
              <div className="onboarding-top">
                <div className="onboarding-progress">
                  {dataSteps.map((step, index) => (
                    <span
                      key={step}
                      className={`onboarding-dot ${index <= progressIndex ? "onboarding-dot-active" : ""}`}
                    />
                  ))}
                </div>
                <button type="button" className="onboarding-skip" onClick={handleSkip}>
                  Skip for now
                </button>
              </div>
            )}
            {error && (
              <div className="submit-error">
                {error}
              </div>
            )}
            {/* Regular users can personalize their search; agents already chose
                their account role during registration, so this step is omitted. */}
            {currentStep === "intent" && (
              <div className="onboarding-step">
                <h2 className="onboarding-title">What brings you to VenloRent?</h2>
                <p className="onboarding-subtitle">This helps us tailor what you see first.</p>

                <div className="onboarding-role-list">
                  {SEARCH_INTENTS.map((intent) => {
                    const Icon = intent.icon
                    return (
                      <button
                        type="button"
                        key={intent.id}
                        className={`onboarding-role-card ${formData.searchIntent === intent.id ? "onboarding-role-active" : ""}`}
                        onClick={() => setFormData((prev) => ({ ...prev, searchIntent: intent.id }))}
                      >
                        <Icon className="onboarding-role-icon" />
                        <div className="onboarding-role-text">
                          <span className="onboarding-role-label">{intent.label}</span>
                          <span className="onboarding-role-description">{intent.description}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* STEP: Locations */}
            {currentStep === "locations" && (
              <div className="onboarding-step">
                <h2 className="onboarding-title">
                  {isAgentAccount ? "Where do you list properties?" : "Where are you searching?"}
                </h2>
                <p className="onboarding-subtitle">
                  {isAgentAccount
                    ? "Choose every city where you actively serve clients."
                    : "Pick every city you would consider living in."}
                </p>

                <div className="onboarding-chip-row">
                  {CITIES.map((city) => (
                    <button
                      type="button"
                      key={city}
                      className={`onboarding-chip ${formData.locations.includes(city) ? "onboarding-chip-active" : ""}`}
                      onClick={() => toggleLocation(city)}
                    >
                      <FiMapPin className="onboarding-chip-icon" />
                      {city}
                    </button>
                  ))}
                </div>

                <div className="onboarding-field">
                  <label htmlFor="otherLocation" className="onboarding-label">
                    {isAgentAccount ? "Another service area?" : "Somewhere else?"} <span className="optional-tag">(optional)</span>
                  </label>
                  <input
                    id="otherLocation"
                    className="onboarding-input"
                    placeholder={isAgentAccount ? "e.g. Benin City" : "e.g. Ibadan"}
                    value={formData.otherLocation}
                    onChange={(e) => setFormData((prev) => ({ ...prev, otherLocation: e.target.value }))}
                  />
                </div>
              </div>
            )}

            {/* STEP: Preferences */}
            {currentStep === "preferences" && (
              <div className="onboarding-step">
                <h2 className="onboarding-title">
                  {isAgentAccount ? "What properties do you list?" : "What kind of property are you looking for?"}
                </h2>
                <p className="onboarding-subtitle">
                  {isAgentAccount
                    ? "This helps us prepare the right listing experience for you."
                    : "We'll prioritize these properties in your feed and search."}
                </p>

                <div className="onboarding-field">
                  <span className="onboarding-label">{isAgentAccount ? "Listing category" : "Category"}</span>
                  <div className="onboarding-chip-row">
                    {CATEGORIES.map((cat) => (
                      <button
                        type="button"
                        key={cat}
                        className={`onboarding-chip ${formData.category === cat ? "onboarding-chip-active" : ""}`}
                        onClick={() => setFormData((prev) => ({ ...prev, category: cat }))}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="onboarding-field">
                  <span className="onboarding-label">{isAgentAccount ? "Property types you list" : "House type"}</span>
                  <div className="onboarding-chip-row">
                    {PROPERTY_TYPE.map((type) => (
                      <button
                        type="button"
                        key={type}
                        className={`onboarding-chip ${formData.propertyTypes.includes(type) ? "onboarding-chip-active" : ""}`}
                        onClick={() => togglePropertyType(type)}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                {!isAgentAccount && (
                <div className="onboarding-field">
                  <span className="onboarding-label">Bedrooms</span>
                  <div className="onboarding-chip-row">
                    {BEDROOM_OPTIONS.map((count) => (
                      <button
                        key={count}
                        className={`onboarding-chip ${formData.bedrooms.includes(count) ? "onboarding-chip-active" : ""}`}
                        onClick={() => toggleBedroom(count)}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>
                )}
                {/* Active searchers provide timing so their feed can prioritize
                    more immediate opportunities; explorers are not asked for it. */}
                {!isAgentAccount && formData.searchIntent === "searching" && (
                  <div className="onboarding-field">
                    <span className="onboarding-label">
                      When are you looking to move?
                    </span>
                    <div className="onboarding-chip-row">
                      {MOVE_IN_OPTIONS.map((option) => (
                        <button
                          type="button"
                          key={option}
                          className={`onboarding-chip ${formData.moveIn === option ? "onboarding-chip-active" : ""}`}
                          onClick={() => setFormData((prev) => ({ ...prev, moveIn: option }))}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP: Verify (agents only) */}
            {currentStep === "verify" && (
              <div className="onboarding-step">
                <h2 className="onboarding-title">One more thing, agents get verified</h2>
                <p className="onboarding-subtitle">
                  Every agent goes through a quick ID check before they can list a property.
                  It usually takes 24-48 hours.
                </p>

                <div className="onboarding-verify-card">
                  <MdVerifiedUser className="onboarding-verify-icon" />
                  <div>
                    <h4>Why we verify agents</h4>
                    <p>
                      Verification keeps VenloRent free of scams and fake listings, and it
                      earns you a verified badge that clients trust.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP: Complete */}
            {currentStep === "complete" && (
              <div className="onboarding-step onboarding-complete">
                <FiCheckCircle className="onboarding-complete-icon" />
                <h2 className="onboarding-title">You're all set!</h2>
                <p className="onboarding-subtitle">
                  {isAgentAccount
                    ? "You can start browsing now, and verify your account whenever you're ready to list."
                    : "We've tailored your feed based on what you told us. You can update this anytime in Account settings."}
                </p>

                <div className="onboarding-complete-actions">
                  <ClickButton
                    text={isAgentAccount ? "Continue to verification" : "Go to Dashboard"}
                    variant="primary"
                    size="large"
                    onClick={handleFinish}
                  />
                </div>
              </div>
            )}

            {/* Navigation */}
            {currentStep !== "complete" && (
              <div className="onboarding-nav">
                {stepIndex > 0 ? (
                  <button type="button" className="onboarding-back-btn" onClick={handleBack}>
                    <FiArrowLeft /> Back
                  </button>
                ) : <span />}

                <ClickButton
                  text={isSubmitting ? "Saving..." : isLastDataStep ? "Continue" : "Next"}
                  variant="primary"
                  onClick={handleNext}
                  disabled={!canProceed() || isSubmitting}
                  isLoading={isSubmitting}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Onboarding
