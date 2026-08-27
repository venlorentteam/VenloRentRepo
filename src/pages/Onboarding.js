import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import './Onboarding.css'
import { ClickButton } from '../exports'
import venlorentLogo from '../assets/img/venlorent.png'
import { FiHome, FiBriefcase, FiCompass, FiMapPin, FiCheckCircle, FiArrowLeft } from 'react-icons/fi'
import { MdVerifiedUser } from 'react-icons/md'

const ONBOARDING_ILLUSTRATION = "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"

const ROLES = [
  { id: "seeker", label: "I'm looking for a place", icon: FiHome, description: "Browse verified listings and message agents." },
  { id: "agent", label: "I list properties", icon: FiBriefcase, description: "Post listings once your account is verified." },
  { id: "exploring", label: "Just exploring", icon: FiCompass, description: "See how VenloRent works before deciding." },
]

const CITIES = ["Lagos", "Abuja", "Port Harcourt"]
const CATEGORIES = ["Rent", "Sale", "Shortlet"]
const HOUSE_TYPES = ["Studio", "1 Bedroom", "2 Bedroom", "3 Bedroom", "4+ Bedroom", "Duplex", "Bungalow", "Penthouse"]
const MOVE_IN_OPTIONS = ["As soon as possible", "Within a month", "Just browsing for now"]

// TODO: walter, remember to replace with a real API call once the backend is ready, e.g.
// return axios.post('/api/users/onboarding', payload)
async function submitOnboarding(payload) {
  localStorage.setItem("venlorent_onboarding", JSON.stringify(payload))
  localStorage.setItem("venlorent_onboarding_complete", "true")
  return Promise.resolve({ success: true })
}

function Onboarding() {
  const navigate = useNavigate()
  const [stepIndex, setStepIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    role: "",
    locations: [],
    otherLocation: "",
    category: "",
    houseTypes: [],
    moveIn: "",
  })

  // Agents get one extra step (a verification heads-up) before the flow completes
  const steps = useMemo(() => {
    const flow = ["role", "locations", "preferences"]
    if (formData.role === "agent") flow.push("verify")
    flow.push("complete")
    return flow
  }, [formData.role])

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

  const toggleHouseType = (type) => {
    setFormData((prev) => ({
      ...prev,
      houseTypes: prev.houseTypes.includes(type)
        ? prev.houseTypes.filter((t) => t !== type)
        : [...prev.houseTypes, type],
    }))
  }

  const canProceed = () => {
    switch (currentStep) {
      case "role":
        return !!formData.role
      case "locations":
        return formData.locations.length > 0 || formData.otherLocation.trim() !== ""
      case "preferences":
        return !!formData.category && formData.houseTypes.length > 0
      default:
        return true
    }
  }

  const handleNext = async () => {
    if (!canProceed()) return

    if (isLastDataStep) {
      setIsSubmitting(true)
      await submitOnboarding(formData)
      setIsSubmitting(false)
    }
    setStepIndex((i) => Math.min(i + 1, steps.length - 1))
  }

  const handleBack = () => {
    setStepIndex((i) => Math.max(i - 1, 0))
  }

  const handleSkip = async () => {
    await submitOnboarding({ skipped: true })
    navigate("/dashboard")
  }

  const handleFinish = () => {
    navigate("/dashboard")
  }

  const handleStartVerification = () => {
    // Matches the "kyc" entry in SettingsMenu -> /account/kyc
    navigate("/account/kyc")
  }

  const dataSteps = steps.filter((s) => s !== "complete")
  const progressIndex = dataSteps.indexOf(currentStep)

  return (
    <div className="onboarding-page">
      <div className="onboarding-shell">
        <div className="onboarding-brand-wrap">
          <img src={venlorentLogo} alt="VenloRent logo" className="onboarding-brand-logo" />
        </div>

        <div className="onboarding-layout">
          <aside className="onboarding-visual-panel">
            <div className="onboarding-visual-card">
              <img src={ONBOARDING_ILLUSTRATION} alt="Modern apartment interior" className="onboarding-visual-image" />
              <div className="onboarding-visual-badge onboarding-badge-top">Verified homes</div>
              <div className="onboarding-visual-badge onboarding-badge-bottom">Trusted by 2k+ people</div>
            </div>
          </aside>

          <div className="onboarding-card">
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

            {/* STEP: Role */}
            {currentStep === "role" && (
              <div className="onboarding-step">
                <h2 className="onboarding-title">What brings you to VenloRent?</h2>
                <p className="onboarding-subtitle">This helps us tailor what you see first.</p>

                <div className="onboarding-role-list">
                  {ROLES.map((role) => {
                    const Icon = role.icon
                    return (
                      <button
                        type="button"
                        key={role.id}
                        className={`onboarding-role-card ${formData.role === role.id ? "onboarding-role-active" : ""}`}
                        onClick={() => setFormData((prev) => ({ ...prev, role: role.id }))}
                      >
                        <Icon className="onboarding-role-icon" />
                        <div className="onboarding-role-text">
                          <span className="onboarding-role-label">{role.label}</span>
                          <span className="onboarding-role-description">{role.description}</span>
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
                  Where are you {formData.role === "agent" ? "listing" : "searching"}?
                </h2>
                <p className="onboarding-subtitle">Pick as many cities as apply.</p>

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
                    Somewhere else? <span className="optional-tag">(optional)</span>
                  </label>
                  <input
                    id="otherLocation"
                    className="onboarding-input"
                    placeholder="e.g. Ibadan"
                    value={formData.otherLocation}
                    onChange={(e) => setFormData((prev) => ({ ...prev, otherLocation: e.target.value }))}
                  />
                </div>
              </div>
            )}

            {/* STEP: Preferences */}
            {currentStep === "preferences" && (
              <div className="onboarding-step">
                <h2 className="onboarding-title">What kind of property?</h2>
                <p className="onboarding-subtitle">We'll prioritize this in your feed and search.</p>

                <div className="onboarding-field">
                  <span className="onboarding-label">Category</span>
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
                  <span className="onboarding-label">House type</span>
                  <div className="onboarding-chip-row">
                    {HOUSE_TYPES.map((type) => (
                      <button
                        type="button"
                        key={type}
                        className={`onboarding-chip ${formData.houseTypes.includes(type) ? "onboarding-chip-active" : ""}`}
                        onClick={() => toggleHouseType(type)}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="onboarding-field">
                  <span className="onboarding-label">
                    When are you looking to move? <span className="optional-tag">(optional)</span>
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
                  {formData.role === "agent"
                    ? "You can start browsing now, and verify your account whenever you're ready to list."
                    : "We've tailored your feed based on what you told us. You can update this anytime in Account settings."}
                </p>

                <div className="onboarding-complete-actions">
                  {formData.role === "agent" && (
                    <ClickButton
                      text="Verify my account now"
                      variant="outline"
                      size="large"
                      onClick={handleStartVerification}
                    />
                  )}
                  <ClickButton
                    text="Go to Dashboard"
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