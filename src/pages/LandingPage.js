import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './LandingPage.css'
import { PrelimFooter, LandingPageHeader } from '../exports'

// Icons (react-icons)
import { RiVerifiedBadgeFill } from 'react-icons/ri'
import { GrLocation } from 'react-icons/gr'
import { FiSearch, FiArrowRight, FiX } from 'react-icons/fi'
import { BiBed, BiBath } from 'react-icons/bi'
import { MdApartment } from 'react-icons/md'
import { HiOutlineShieldCheck } from 'react-icons/hi'
import { TbHomeSearch } from 'react-icons/tb'
import { LuBuilding2 } from 'react-icons/lu'

// ─── AUTH GATE MODAL ─────────────────────────────────────────────────────────
function AuthGateModal({ onClose }) {
  return (
    <div className="authgate-overlay" onClick={onClose}>
      <div className="authgate-modal" onClick={e => e.stopPropagation()}>
        <button className="authgate-close" onClick={onClose} aria-label="Close">
          <FiX />
        </button>

        {/* Illustration */}
        <div className="authgate-illustration">
          <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="gate-svg">
            <rect x="20" y="40" width="120" height="70" rx="8" fill="var(--primary-color)" fillOpacity="0.12" />
            <path d="M80 20L110 45H50L80 20Z" fill="var(--primary-color)" fillOpacity="0.6" />
            <rect x="60" y="70" width="40" height="40" rx="4" fill="var(--primary-color)" fillOpacity="0.25" />
            <circle cx="80" cy="90" r="8" fill="var(--primary-color)" fillOpacity="0.8" />
            <path d="M77 90L79 92L83 88" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h2 className="authgate-title">Sign in to continue</h2>
        <p className="authgate-text">
          Create a free account or log in to view full property details, contact agents, and more.
        </p>

        <div className="authgate-actions">
          <Link to="/register" className="btn btn-primary authgate-btn">
            Create Free Account
          </Link>
          <Link to="/login" className="btn btn-outline authgate-btn">
            Log In
          </Link>
        </div>

        <p className="authgate-note">No credit card required · Free to browse</p>
      </div>
    </div>
  )
}

// ─── FEATURED PROPERTY CARD ───────────────────────────────────────────────────
function FeaturedCard({ property, onGate }) {
  return (
    <div className="featured-card" onClick={onGate}>
      <div className="featured-card-img-wrap">
        <img src={property.image} alt={property.title} className="featured-card-img" loading="lazy" />
        <span className={`featured-badge ${property.category === 'For Sale' ? 'badge-sale' : property.category === 'Shortlet' ? 'badge-shortlet' : 'badge-rent'}`}>
          {property.category}
        </span>
        <div className="featured-card-overlay">
          <span className="view-listing-btn">View Listing <FiArrowRight /></span>
        </div>
      </div>

      <div className="featured-card-body">
        <div className="featured-card-price">
          ₦{property.price}
          {property.category === 'For Rent' && <span>/yr</span>}
        </div>
        <h3 className="featured-card-title">{property.title}</h3>
        <div className="featured-card-location">
          <GrLocation />
          <span>{property.location}</span>
        </div>
        <div className="featured-card-meta">
          <span><BiBed /> {property.beds} Beds</span>
          <span><BiBath /> {property.baths} Baths</span>
          <span><MdApartment /> {property.type}</span>
        </div>
        <div className="featured-card-agent">
          <img src={property.agentAvatar} alt={property.agentName} className="agent-avatar" />
          <span className="agent-name">{property.agentName}</span>
          {property.verified && <RiVerifiedBadgeFill className="verified-icon" />}
        </div>
      </div>
    </div>
  )
}

// ─── STAT COUNTER ─────────────────────────────────────────────────────────────
function StatCounter({ value, label }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const target = parseInt(value.replace(/\D/g, ''))
    const duration = 1500
    const step = Math.ceil(target / (duration / 16))
    let current = 0
    const timer = setInterval(() => {
      current = Math.min(current + step, target)
      setCount(current)
      if (current >= target) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [value])

  const suffix = value.replace(/[0-9]/g, '')
  return (
    <div className="stat-item">
      <span className="stat-value">{count.toLocaleString()}{suffix}</span>
      <span className="stat-label">{label}</span>
    </div>
  )
}

// ==================================
//  Main Landing Page Component
// ==================================
function LandingPage() {
  const navigate = useNavigate()
  const [showAuthGate, setShowAuthGate] = useState(false)
  const [activeTab, setActiveTab] = useState('rent')

  const openGate = () => setShowAuthGate(true)
  const closeGate = () => setShowAuthGate(false)

  const featuredProperties = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
      category: 'For Rent',
      price: '1,200,000',
      title: 'Luxury 3-Bedroom Apartment',
      location: 'Maitama, Abuja',
      beds: 3, baths: 2, type: 'Apartment',
      agentAvatar: 'https://i.pravatar.cc/100?img=12',
      agentName: 'Emeka Realty',
      verified: true,
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
      category: 'For Sale',
      price: '85,000,000',
      title: 'Modern 4-Bedroom Duplex',
      location: 'Lekki Phase 1, Lagos',
      beds: 4, baths: 3, type: 'Duplex',
      agentAvatar: 'https://i.pravatar.cc/100?img=25',
      agentName: 'Ade Properties',
      verified: true,
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
      category: 'For Rent',
      price: '700,000',
      title: 'Cozy 2-Bedroom Flat',
      location: 'Garki, Abuja',
      beds: 2, baths: 1, type: 'Flat',
      agentAvatar: 'https://i.pravatar.cc/100?img=33',
      agentName: 'Grace Homes',
      verified: false,
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=600&q=80',
      category: 'Shortlet',
      price: '45,000',
      title: 'Furnished Studio, City View',
      location: 'Victoria Island, Lagos',
      beds: 1, baths: 1, type: 'Studio',
      agentAvatar: 'https://i.pravatar.cc/100?img=47',
      agentName: 'Lagos Stays',
      verified: true,
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80',
      category: 'For Sale',
      price: '45,000,000',
      title: 'Elegant 3-Bed Terrace',
      location: 'Gwarinpa, Abuja',
      beds: 3, baths: 2, type: 'Terrace',
      agentAvatar: 'https://i.pravatar.cc/100?img=55',
      agentName: 'Crown Realtors',
      verified: true,
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
      category: 'For Rent',
      price: '900,000',
      title: 'Spacious Mini Flat',
      location: 'Wuse 2, Abuja',
      beds: 2, baths: 1, type: 'Mini Flat',
      agentAvatar: 'https://i.pravatar.cc/100?img=60',
      agentName: 'Nnamdi Homes',
      verified: false,
    },
  ]

  const filtered = activeTab === 'all'
    ? featuredProperties
    : activeTab === 'rent'
      ? featuredProperties.filter(p => p.category === 'For Rent')
      : activeTab === 'buy'
        ? featuredProperties.filter(p => p.category === 'For Sale')
        : featuredProperties.filter(p => p.category === 'Shortlet')

  return (
    <div className="landing-page">
      {/* Import Landing Navgation */}
      <LandingPageHeader 
        openGateModal={openGate}
      />
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="hero-section">
        {/* Decorative blobs */}
        <div className="hero-blob hero-blob-1" aria-hidden="true" />
        <div className="hero-blob hero-blob-2" aria-hidden="true" />

        <div className="hero-content">
          <div className="hero-badge">
            <HiOutlineShieldCheck />
            <span>Verified agents only</span>
          </div>
          <h1 className="hero-heading">
            Find Your Next<br />
            <span className="hero-heading-accent">Home in Nigeria</span>
          </h1>
          <p className="hero-sub">
            VenloRent connects you with verified real estate agents for rent, sale, and shortlet properties — transparently, securely, all in one place.
          </p>

          {/* Search Bar */}
          <div className="hero-search">
            <div className="search-wrap">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by location, type, or keyword..."
                className="hero-search-input"
                onFocus={openGate}
                readOnly
              />
              <button className="hero-search-btn" onClick={openGate}>Search</button>
            </div>
            <div className="hero-search-tags">
              {['Abuja', 'Lagos', 'Port Harcourt', '2 Bedroom', 'Duplex'].map(tag => (
                <button key={tag} className="search-tag" onClick={openGate}>{tag}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Hero Illustration */}
        <div className="hero-illustration">
          <div className="hero-house-card hero-card-main">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&q=80"
              alt="Featured property"
              className="hero-house-img"
            />
            <div className="hero-card-info">
              <div className="hero-card-price">₦1,200,000<small>/yr</small></div>
              <div className="hero-card-loc"><GrLocation /> Maitama, Abuja</div>
            </div>
          </div>
          <div className="hero-house-card hero-card-side">
            <img
              src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80"
              alt="Property"
              className="hero-house-img"
            />
            <div className="hero-card-info">
              <div className="hero-card-price">₦700,000<small>/yr</small></div>
              <div className="hero-card-loc"><GrLocation /> Garki, Abuja</div>
            </div>
          </div>
          {/* Floating badges */}
          <div className="float-badge float-badge-1">
            <RiVerifiedBadgeFill className="fb-icon" />
            <div>
              <p className="fb-title">Verified Agent</p>
              <p className="fb-sub">KYC approved</p>
            </div>
          </div>
          <div className="float-badge float-badge-2">
            <span className="fb-number">500+</span>
            <p className="fb-sub">Properties Listed</p>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <section className="stats-section">
        <div className="stats-inner">
          <StatCounter value="500+" label="Verified Agents" />
          <div className="stats-divider" aria-hidden="true" />
          <StatCounter value="2000+" label="Active Seekers" />
          <div className="stats-divider" aria-hidden="true" />
          <StatCounter value="1200+" label="Properties Listed" />
          <div className="stats-divider" aria-hidden="true" />
          <StatCounter value="100+" label="Deals Closed" />
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="how-section" id="how">
        <div className="section-header">
          <span className="section-eyebrow">Simple Process</span>
          <h2 className="section-title">How VenloRent Works</h2>
          <p className="section-sub">From search to keys — all on one platform</p>
        </div>

        <div className="how-steps">
          {[
            {
              step: '01',
              icon: <TbHomeSearch />,
              title: 'Browse Listings',
              desc: 'Explore thousands of verified properties filtered by location, price, and type.',
            },
            {
              step: '02',
              icon: <RiVerifiedBadgeFill />,
              title: 'Connect with Agents',
              desc: 'Message KYC-verified agents directly. No middlemen, no guessing.',
            },
            {
              step: '03',
              icon: <HiOutlineShieldCheck />,
              title: 'Place an Order',
              desc: 'Reserve a property for 3 days while you inspect. Secure and transparent.',
            },
            {
              step: '04',
              icon: <LuBuilding2 />,
              title: 'Move In',
              desc: 'Complete payment safely through the platform and get your new home.',
            },
          ].map(({ step, icon, title, desc }) => (
            <div className="how-step" key={step}>
              <div className="how-step-num">{step}</div>
              <div className="how-step-icon">{icon}</div>
              <h3 className="how-step-title">{title}</h3>
              <p className="how-step-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED LISTINGS ─────────────────────────────────────────────── */}
      <section className="listings-section" id="listings">
        <div className="section-header">
          <span className="section-eyebrow">Featured Properties</span>
          <h2 className="section-title">Explore Available Homes</h2>
          <p className="section-sub">Hand-picked listings from verified agents across Nigeria</p>
        </div>

        {/* Filter Tabs */}
        <div className="listing-tabs">
          {['all', 'rent', 'buy', 'shortlet'].map(tab => (
            <button
              key={tab}
              className={`listing-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'all' ? 'All' : tab === 'rent' ? 'For Rent' : tab === 'buy' ? 'For Sale' : 'Shortlet'}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="listings-grid">
          {filtered.map(property => (
            <FeaturedCard key={property.id} property={property} onGate={openGate} />
          ))}
        </div>

        {/* View More CTA */}
        <div className="listings-cta">
          <p className="listings-cta-text">Sign up to see all listings and contact agents</p>
          <button className="btn btn-primary" onClick={openGate}>
            View All Properties <FiArrowRight />
          </button>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section className="features-section" id="features">
        <div className="features-inner">
          {/* Left: Illustration */}
          <div className="features-illustration">
            <div className="features-phone-mock">
              <div className="phone-screen">
                <div className="phone-header">
                  <span className="phone-logo">VenloRent</span>
                </div>
                <div className="phone-card" />
                <div className="phone-card phone-card-sm" />
                <div className="phone-card phone-card-sm" />
                <div className="phone-verified-badge">
                  <RiVerifiedBadgeFill /> Verified Agent
                </div>
              </div>
            </div>
            <div className="features-blob" aria-hidden="true" />
          </div>

          {/* Right: Feature list */}
          <div className="features-content">
            <span className="section-eyebrow">Why Choose Us</span>
            <h2 className="section-title">Built for Trust &amp; Transparency</h2>
            <div className="feature-list">
              {[
                {
                  icon: <HiOutlineShieldCheck />,
                  title: 'Verified Agents Only',
                  desc: 'Every agent goes through a manual KYC review before listing properties.',
                },
                {
                  icon: <RiVerifiedBadgeFill />,
                  title: 'Transparent Pricing',
                  desc: 'Clear breakdown of rent, commission, and all fees — no hidden charges.',
                },
                {
                  icon: <TbHomeSearch />,
                  title: 'Smart Matching',
                  desc: 'Post your property request and let verified agents come to you.',
                },
                {
                  icon: <LuBuilding2 />,
                  title: 'Secure Transactions',
                  desc: 'Payments processed safely through Flutterwave — held until completion.',
                },
              ].map(({ icon, title, desc }) => (
                <div className="feature-item" key={title}>
                  <div className="feature-icon-home">{icon}</div>
                  <div>
                    <h4 className="feature-title">{title}</h4>
                    <p className="feature-desc">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn btn-primary" onClick={openGate}>
              Get Started Free <FiArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────────── */}
      <section className="cta-section">
        <div className="cta-blob" aria-hidden="true" />
        <div className="cta-inner">
          <h2 className="cta-title">Ready to find your home?</h2>
          <p className="cta-sub">Join thousands of Nigerians who've found their perfect property on VenloRent.</p>
          <div className="cta-actions">
            <Link to="/register" className="btn btn-white">Create Free Account</Link>
            <Link to="/login" className="btn btn-outline-white">I have an account</Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <PrelimFooter />

      {/* ── AUTH GATE MODAL ───────────────────────────────────────────────── */}
      {showAuthGate && <AuthGateModal onClose={closeGate} />}
    </div>
  )
}

export default LandingPage
