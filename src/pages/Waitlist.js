import React, { useState } from 'react'
import './Waitlist.css'
import { PrelimFooter, SubmitButton } from '../exports'
import venlorentLogo from '../assets/img/venlorent.png'
import { FiCheckCircle, FiShield, FiMapPin, FiCreditCard, FiStar, FiTrendingUp } from 'react-icons/fi'
import { MdLocationOn } from 'react-icons/md'

const WAITLIST_ENDPOINT = "https://formspree.io/f/xppzayde"

const CITIES = ["Lagos", "Abuja", "Port Harcourt", "Other"]
const INTERESTS = [
  { id: "seeker", label: "I'm looking for a place" },
  { id: "agent", label: "I list properties" },
  { id: "exploring", label: "Just exploring" },
]

function Waitlist() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    city: "",
    interest: "",
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleCitySelect = (city) => {
    setFormData((prev) => ({ ...prev, city }))
    if (errors.city) setErrors((prev) => ({ ...prev, city: "" }))
  }

  const handleInterestSelect = (interest) => {
    setFormData((prev) => ({ ...prev, interest }))
    if (errors.interest) setErrors((prev) => ({ ...prev, interest: "" }))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.fullName.trim()) newErrors.fullName = "Your name is required"
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address"
    }
    if (!formData.city) newErrors.city = "Select a city"
    if (!formData.interest) newErrors.interest = "Let us know what brings you here"
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setIsLoading(true)
    try {
      const res = await fetch(WAITLIST_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setIsSubmitted(true)
      } else {
        setErrors({ submit: "Something went wrong. Please try again." })
      }
    } catch (err) {
      setErrors({ submit: "Something went wrong. Please try again." })
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error(err)
    }
  }

  const firstName = formData.fullName.trim().split(" ")[0]

  return (
    <div className="waitlist-page">
      <header className="waitlist-topbar">
        <div className="waitlist-brand">
          <img src={venlorentLogo} alt="VenloRent logo" className="waitlist-brand-logo" />
        </div>
      </header>

      <main className="waitlist-shell">
        <section className="waitlist-hero">
          <div className="waitlist-hero-copy">
            <span className="waitlist-eyebrow">Now opening in Lagos • Abuja • Port Harcourt</span>
            <h1 className="waitlist-headline">Your next home should feel easy.</h1>
            <p className="waitlist-subheadline">
              Explore real listings, speak to verified agents, and find a place you actually love — without the chaos.
            </p>

            <div className="waitlist-proof-row">
              <div className="proof-pill">
                <FiTrendingUp className="proof-icon" />
                1k+ early signups
              </div>
              <div className="proof-pill">
                <FiStar className="proof-icon" />
                Verified agents only
              </div>
            </div>

            {!isSubmitted ? (
              <form className="waitlist-form" onSubmit={handleSubmit} noValidate>
                <input type="text" name="_gotcha" style={{ display: "none" }} tabIndex="-1" autoComplete="off" />

                <div className="waitlist-form-row">
                  <div className="waitlist-form-group">
                    <label htmlFor="fullName" className="waitlist-label">Full name</label>
                    <input
                      id="fullName"
                      name="fullName"
                      className={`waitlist-input ${errors.fullName ? "input-error" : ""}`}
                      placeholder="e.g. Amaka Obi"
                      value={formData.fullName}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                    {errors.fullName && <span className="waitlist-error">{errors.fullName}</span>}
                  </div>

                  <div className="waitlist-form-group">
                    <label htmlFor="email" className="waitlist-label">Email address</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className={`waitlist-input ${errors.email ? "input-error" : ""}`}
                      placeholder="you@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                    {errors.email && <span className="waitlist-error">{errors.email}</span>}
                  </div>
                </div>

                <div className="waitlist-form-group">
                  <span className="waitlist-label">Which city?</span>
                  <div className="waitlist-chip-row">
                    {CITIES.map((city) => (
                      <button
                        type="button"
                        key={city}
                        className={`waitlist-chip ${formData.city === city ? "waitlist-chip-active" : ""}`}
                        onClick={() => handleCitySelect(city)}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                  {errors.city && <span className="waitlist-error">{errors.city}</span>}
                </div>

                <div className="waitlist-form-group">
                  <span className="waitlist-label">What brings you here?</span>
                  <div className="waitlist-interest-cards">
                    {INTERESTS.map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        className={`waitlist-interest-card ${formData.interest === item.id ? "waitlist-interest-active" : ""}`}
                        onClick={() => handleInterestSelect(item.id)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                  {errors.interest && <span className="waitlist-error">{errors.interest}</span>}
                </div>

                {errors.submit && <div className="waitlist-submit-error">{errors.submit}</div>}

                <SubmitButton
                  text={isLoading ? "Joining..." : "Join the waitlist"}
                  disabled={isLoading}
                  isLoading={isLoading}
                />

                <p className="waitlist-fineprint">
                  We’ll only use this to share launch updates. No spam. No hassle.
                </p>
              </form>
            ) : (
              <div className="waitlist-success">
                <FiCheckCircle className="waitlist-success-icon" />
                <h2>You're on the list{firstName ? `, ${firstName}` : ""}!</h2>
                <p>We'll email <strong>{formData.email}</strong> the moment VenloRent opens in {formData.city}.</p>
                <p className="waitlist-share-prompt">Know someone hunting for a place? Share VenloRent with them.</p>
                <button type="button" className="waitlist-copy-btn" onClick={handleCopyLink}>
                  {copied ? "Link copied!" : "Copy invite link"}
                </button>
              </div>
            )}
          </div>

          <aside className="waitlist-visual" aria-label="VenloRent market preview">
            <div className="visual-glow" />
            <div className="visual-card visual-card-main">
              <div className="mini-header">
                <span className="mini-dot" />
                <span className="mini-dot" />
                <span className="mini-dot" />
              </div>

              <div className="mini-property">
                <div className="mini-property-visual" />
                <div className="mini-property-copy">
                  <p className="mini-tag">Verified listing</p>
                  <h3>Luxury 2-bedroom flat</h3>
                  <div className="mini-meta">
                    <span>₦ 4.2M/yr</span>
                    <span>2 beds</span>
                  </div>
                </div>
              </div>

              <div className="mini-list">
                <div className="mini-list-item">
                  <span className="mini-bullet green" />
                  <span>Available in Lekki</span>
                </div>
                <div className="mini-list-item">
                  <span className="mini-bullet gold" />
                  <span>Verified agent</span>
                </div>
                <div className="mini-list-item">
                  <span className="mini-bullet blue" />
                  <span>Instant shortlist</span>
                </div>
              </div>
            </div>

            <div className="floating-pill pill-top">
              <MdLocationOn />
              <span>Lagos • 280 homes</span>
            </div>

            <div className="floating-pill pill-bottom">
              <FiShield />
              <span>Trusted by renters</span>
            </div>
          </aside>
        </section>

        <section className="waitlist-values">
          <article className="waitlist-value-card">
            <FiShield className="waitlist-value-icon" />
            <h3>Verified agents only</h3>
            <p>Every agent is checked before they can list a property.</p>
          </article>
          <article className="waitlist-value-card">
            <FiMapPin className="waitlist-value-icon" />
            <h3>Real listings, one place</h3>
            <p>No scattered groups, fake listings, or endless DMs.</p>
          </article>
          <article className="waitlist-value-card">
            <FiCreditCard className="waitlist-value-icon" />
            <h3>Pay with confidence</h3>
            <p>Reserve, inspect, and pay in-app with a smoother flow.</p>
          </article>
        </section>
      </main>

      <PrelimFooter />
    </div>
  )
}

export default Waitlist