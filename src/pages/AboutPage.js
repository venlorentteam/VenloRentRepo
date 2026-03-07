import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './AboutPage.css'
import { PrelimFooter, LandingPageHeader, StatCounter, CtaBanner } from '../exports'

// Icons — same library choices as LandingPage
import { RiVerifiedBadgeFill } from 'react-icons/ri'
import { FiArrowRight, FiUsers, FiMessageSquare, FiShield } from 'react-icons/fi'
import { HiOutlineShieldCheck } from 'react-icons/hi'
import { TbHomeSearch, TbBuildingEstate } from 'react-icons/tb'
import { LuBuilding2, LuTarget, LuHeart } from 'react-icons/lu'
import { MdOutlineVerified, MdOutlinePayments } from 'react-icons/md'
import { BiTrendingUp } from 'react-icons/bi'
import { BsPersonCheck } from 'react-icons/bs'

// VALUE CARD
function ValueCard({ icon, title, desc }) {
  return (
    <div className="value-card card">
      <div className="value-card-icon">{icon}</div>
      <h3 className="value-card-title">{title}</h3>
      <p className="value-card-desc">{desc}</p>
    </div>
  )
}

//  TEAM MEMBER CARD 
function TeamCard({ avatar, name, role, bio }) {
  return (
    <div className="team-card card">
      <div className="team-avatar-wrap">
        <img src={avatar} alt={name} className="team-avatar" loading="lazy" />
        <span className="team-verified-dot" aria-label="Verified team member">
          <RiVerifiedBadgeFill />
        </span>
      </div>
      <h3 className="team-name">{name}</h3>
      {/* <span className="team-role">{role}</span> ===Roles to be decided and assumed in due time=== */}
      <p className="team-bio">{bio}</p>
    </div>
  )
}


// MILESTONE ITEM 
function Milestone({ year, title, desc, isLast }) {
  return (
    <div className="milestone-item">
      <div className="milestone-left">
        <span className="milestone-year">{year}</span>
      </div>
      <div className="milestone-connector">
        <div className="milestone-dot" />
        {!isLast && <div className="milestone-line" />}
      </div>
      <div className="milestone-right">
        <h4 className="milestone-title">{title}</h4>
        <p className="milestone-desc">{desc}</p>
      </div>
    </div>
  )
}


// =====================================
//  ABOUT PAGE
// =====================================
function AboutPage() {
  
  const navigate = useNavigate()
  const values = [
    {
      icon: <HiOutlineShieldCheck />,
      title: 'Trust Above All',
      desc: 'Every agent on VenloRent is manually KYC-verified. We eliminate anonymous actors so you always know who you\'re dealing with.',
    },
    {
      icon: <MdOutlineVerified />,
      title: 'Radical Transparency',
      desc: 'Rent, commission, and platform fees are broken down before you pay — no hidden charges, no last-minute surprises.',
    },
    {
      icon: <FiMessageSquare />,
      title: 'Structured Communication',
      desc: 'All agent-seeker conversations happen on-platform. No scattered WhatsApp threads. No lost context. Everything in one place.',
    },
    {
      icon: <MdOutlinePayments />,
      title: 'Secure Transactions',
      desc: 'Payments flow through vetted providers. Our 3-day reservation system gives you time to inspect before you commit a single naira.',
    },
    {
      icon: <FiUsers />,
      title: 'Two-Way Marketplace',
      desc: 'Seekers post requests, agents post listings. Both sides of the market work actively — so the right match finds you faster.',
    },
    {
      icon: <BiTrendingUp />,
      title: 'Built for Growth',
      desc: 'Starting with the cities we know best, scaling to serve property seekers and agents worldwide — one verified transaction at a time.',
    },
  ]

  const team = [
    {
      avatar: 'https://i.pravatar.cc/150?img=11',
      name: 'Obinabo Walter',
      role: 'Co-Founder & CEO',
      bio: 'Obsessed with solving real problems for real people. The idea for VenloRent came from his own experience trying to find a home.',
    },
    {
      avatar: 'https://i.pravatar.cc/150?img=47',
      name: 'Molokwu Chibuzor',
      role: 'Co-Founder & CTO',
      bio: '3 years in fintech infrastructure. Architected the payment and KYC systems that make every VenloRent transaction trustworthy.',
    },
    {
      avatar: 'https://i.pravatar.cc/150?img=32',
      name: 'Martin Chigbo',
      role: 'Head of Agent Partnerships',
      bio: 'Spent a decade building agency networks across Lagos and Abuja. Now connects verified agents with thousands of seekers daily.',
    },
    // {
    //   avatar: 'https://i.pravatar.cc/150?img=26',
    //   name: 'Ngozi Okonkwo',
    //   role: 'Head of Trust & Safety',
    //   bio: 'Leads manual KYC review and fraud prevention. Her team is the reason the VenloRent badge actually means something.',
    // },
  ]

  const milestones = [
    {
      year: 'Q4 2025',
      title: 'VenloRent is Founded',
      desc: 'After experiencing the real cost of property fraud first-hand, the founding team commits to building a verified real estate marketplace.',
    },
    {
      year: 'Jan 2026',
      title: 'PRD v1.0 & MVP Spec Complete',
      desc: 'Product requirements finalised. Dual listing system, KYC verification flow, 3-day reservation, and in-app payments scoped.',
    },
    {
      year: 'Q1 2026',
      title: 'Private Beta Launch',
      desc: 'First 50 verified agents onboarded. Early seekers post property requests. First transaction successfully completed on-platform.',
    },
    {
      year: 'Q2 2026',
      title: '500 Verified Agents Milestone',
      desc: 'MVP success metric hit ahead of schedule. Platform live across Lagos, Abuja, and Port Harcourt with growing demand.',
    },
    {
      year: 'Q3 2026',
      title: 'Global Expansion Begins',
      desc: 'Platform opens to agents and seekers worldwide. KYC accepts international documents. Payment coverage expanded internationally.',
    },
  ]

  return (
    <div className="about-page">
      <LandingPageHeader />

      {/* Herobanner Section*/}
      <section className="about-hero-section">
        <div className="about-hero-inner">
          <div className="about-hero-content">
            <span className="section-eyebrow">Our Story</span>
            <h1 className="about-hero-title">
              Real estate built on <span className="text-accent">real trust</span>
            </h1>
            <p className="about-hero-sub">
              VenloRent was born from frustration, with scam listings, ghost agents, and
              transactions that disappeared into instant messaging threads never to return. We built
              the platform we wished had existed: one where every agent is verified, every
              fee is transparent, and every transaction is structured from first message to
              final payment.
            </p>
            <div className="about-hero-actions">
              <Link to="/register" className="btn btn-primary">
                Join VenloRent <FiArrowRight />
              </Link>
              {/* <Link to="/listings" className="btn btn-secondary">
                Browse Listings
              </Link> */}
            </div>
          </div>

          {/* Decorative illustration panel */}
          <div className="about-hero-visual" aria-hidden="true">
            <div className="about-hero-card card">
              <div className="ahc-top">
                <div className="ahc-avatar-stack">
                  {[11, 25, 47, 32].map(i => (
                    <img
                      key={i}
                      src={`https://i.pravatar.cc/60?img=${i}`}
                      alt=""
                      className="ahc-avatar"
                    />
                  ))}
                </div>
                <span className="badge badge-primary">
                  <RiVerifiedBadgeFill /> 500+ Verified Agents
                </span>
              </div>
              <div className="ahc-body">
                <div className="ahc-bar">
                  <span className="ahc-bar-label">Trust Score</span>
                  <div className="ahc-bar-track">
                    <div className="ahc-bar-fill" style={{ width: '94%' }} />
                  </div>
                  <span className="ahc-bar-val">94%</span>
                </div>
                <div className="ahc-bar">
                  <span className="ahc-bar-label">KYC Approved</span>
                  <div className="ahc-bar-track">
                    <div className="ahc-bar-fill" style={{ width: '100%' }} />
                  </div>
                  <span className="ahc-bar-val">100%</span>
                </div>
                <div className="ahc-bar">
                  <span className="ahc-bar-label">Fraud Reports</span>
                  <div className="ahc-bar-track">
                    <div className="ahc-bar-fill ahc-bar-danger" style={{ width: '3%' }} />
                  </div>
                  <span className="ahc-bar-val">{'<5%'}</span>
                </div>
              </div>
              <div className="ahc-footer">
                <HiOutlineShieldCheck className="ahc-shield" />
                <span>Platform integrity monitored 24/7</span>
              </div>
            </div>
            <div className="about-hero-blob" />
          </div>
        </div>
      </section>

      {/* ── STATS {Imported styles from LandingPage.css} */}
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

      {/* MISSION & VISION */}
      <section className="mission-section">
        <div className="mission-inner">
          <div className="mission-card card card-listing">
            <div className="mission-icon-wrap">
              <LuTarget />
            </div>
            <span className="section-eyebrow">Our Mission</span>
            <h2 className="mission-title">Eliminate fraud.<br />Restore trust.</h2>
            <p className="mission-body">
              VenloRent exists to solve the three biggest problems in real estate: you can't
              verify who you're dealing with, you can't trust what's written in a listing,
              and you can't be sure your money is safe. We fix all three, through verified
              identities, transparent pricing, and structured on-platform transactions.
            </p>
          </div>

          <div className="mission-card card card-request">
            <div className="mission-icon-wrap mission-icon-cyan">
              <LuHeart />
            </div>
            <span className="section-eyebrow">Our Vision</span>
            <h2 className="mission-title">The world's most trusted property marketplace.</h2>
            <p className="mission-body">
              We want every person, wherever they are, to be able to find a home without
              fear. A platform where seekers browse with confidence, agents compete on merit,
              and every transaction leaves both parties better off than before they arrived.
            </p>
          </div>
        </div>
      </section>

      {/* THE PROBLEM WE SOLVE */}
      <section className="problem-section">
        <div className="section-header">
          <span className="section-eyebrow">Why We Exist</span>
          <h2 className="section-title">The problems VenloRent was built to fix</h2>
          <p className="section-sub">
            These aren't edge cases — they're the everyday reality of finding a home without a platform you can trust.
          </p>
        </div>

        <div className="problem-grid">
          {[
            {
              icon: <FiShield />,
              problem: 'Trust Deficit',
              before: 'Scam listings and ghost agents are rampant. You can\'t verify who you\'re paying.',
              after: 'Every VenloRent agent passes a manual KYC review — government ID, business proof, the works.',
            },
            {
              icon: <FiMessageSquare />,
              problem: 'Communication Chaos',
              before: 'Property details live on WhatsApp, Instagram, and ten different phone calls.',
              after: 'One platform. Listings, requests, messages, orders, and payments — all in one structured flow.',
            },
            {
              icon: <MdOutlinePayments />,
              problem: 'Payment Opacity',
              before: 'Hidden agency fees materialise at the last minute. You never know the true cost.',
              after: 'Rent, commission, and the 2% platform fee are broken down before you confirm a single payment.',
            },
            {
              icon: <TbHomeSearch />,
              problem: 'Agent Discovery',
              before: 'Finding a legitimate, professional agent is a matter of luck and word-of-mouth.',
              after: 'Browse verified agent profiles, follow the ones you trust, and get notified when they list something new.',
            },
            {
              icon: <BsPersonCheck />,
              problem: 'Wasted Viewings',
              before: 'You waste weekends viewing properties that don\'t match what was described.',
              after: 'Detailed listings with 3–10 photos, full specs, and a 3-day reservation to inspect before you pay.',
            },
            {
              icon: <TbBuildingEstate />,
              problem: 'One-Sided Market',
              before: 'Agents push listings. Seekers have no structured way to signal what they need.',
              after: 'Property Requests let seekers post exactly what they\'re looking for — verified agents come to them.',
            },
          ].map(({ icon, problem, before, after }) => (
            <div className="problem-card card" key={problem}>
              <div className="problem-icon">{icon}</div>
              <h3 className="problem-title">{problem}</h3>
              <div className="problem-before">
                <span className="problem-label problem-label-before">Before</span>
                <p>{before}</p>
              </div>
              <div className="problem-after">
                <span className="problem-label problem-label-after">
                  <RiVerifiedBadgeFill /> VenloRent
                </span>
                <p>{after}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* OUR VALUES */}
      <section className="values-section" id="values">
        <div className="section-header">
          <span className="section-eyebrow">What We Stand For</span>
          <h2 className="section-title">The values that shape every decision</h2>
          <p className="section-sub">
            These aren't wall posters. They're the principles baked into every feature,
            every policy, and every line of code.
          </p>
        </div>
        <div className="values-grid">
          {values.map(v => <ValueCard key={v.title} {...v} />)}
        </div>
      </section>

      {/* ── HOW WE WORK (Features split layout — mirrors LandingPage features-section) */}
      <section className="about-features-section">
        <div className="features-inner">
          {/* Left: content */}
          <div className="features-content">
            <span className="section-eyebrow">How It Works</span>
            <h2 className="section-title">A marketplace designed for both sides</h2>
            <p className="about-features-intro">
              Most platforms are built for one user. VenloRent is built for two, the seeker
              who needs a home, and the agent who needs qualified clients.
            </p>
            <div className="feature-list">
              {[
                {
                  icon: <TbHomeSearch />,
                  title: 'For House Seekers',
                  desc: 'Browse listings, post property requests, follow trusted agents, place orders, and pay — all from a single, mobile-first interface.',
                },
                {
                  icon: <LuBuilding2 />,
                  title: 'For Verified Agents',
                  desc: 'Create detailed listings, receive qualified inquiries, boost properties for more visibility, and close deals with a structured order flow.',
                },
                {
                  icon: <HiOutlineShieldCheck />,
                  title: 'Built on Accountability',
                  desc: 'Every action — from a message to a payment — is logged, structured, and accountable. No more transactions disappearing into the void.',
                },
                {
                  icon: <MdOutlinePayments />,
                  title: 'Transparent from Start to Finish',
                  desc: 'Complete price breakdown before payment. 3-day inspection window before commitment. No surprises.',
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
          </div>

          {/* Right: phone mock — same component pattern as LandingPage */}
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
                <div className="phone-order-row">
                  <span className="phone-order-dot" />
                  <span className="phone-order-label">3-day reservation active</span>
                </div>
              </div>
            </div>
            <div className="features-blob" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* MILESTONES / JOURNEY */}
      <section className="milestones-section">
        <div className="section-header">
          <span className="section-eyebrow">Our Journey</span>
          <h2 className="section-title">From idea to marketplace</h2>
          <p className="section-sub">
            Every milestone is a problem we've solved for a real person looking for a real home.
          </p>
        </div>
        <div className="milestones-track">
          {milestones.map((m, i) => (
            <Milestone
              key={m.year}
              {...m}
              isLast={i === milestones.length - 1}
            />
          ))}
        </div>
      </section>

      {/* MEET THE TEAM */}
      <section className="team-section" id="team">
        <div className="section-header">
          <span className="section-eyebrow">The People</span>
          <h2 className="section-title">Meet the team behind VenloRent</h2>
          <p className="section-sub">
            We've lived the problem. We're building the solution.
          </p>
        </div>
        <div className="team-grid">
          {team.map(member => (
            <TeamCard key={member.name} {...member} />
          ))}
        </div>
      </section>

      {/* KYC TRUST CALLOUT */}
      <section className="kyc-section">
        <div className="kyc-inner">
          <div className="kyc-icon-wrap" aria-hidden="true">
            <HiOutlineShieldCheck />
          </div>
          <div className="kyc-content">
            <span className="section-eyebrow">Agent Verification</span>
            <h2 className="section-title">Why the verified badge matters</h2>
            <p className="kyc-body">
              The VenloRent verified badge isn't an algorithm, it's a human decision. Every
              agent submits a government-issued ID, proof of business, and professional details.
              A real person on our Trust & Safety team reviews every submission within 24–48 hours.
              If something doesn't add up, we reject it. If an approved agent is later found to
              have misrepresented themselves, they're permanently banned.
            </p>
            <div className="kyc-checks">
              {[
                'Government-issued photo ID',
                'Proof of business / professional registration',
                'Business name & operational address',
                'Manual review by our Trust & Safety team',
                'Ongoing monitoring — badges can be revoked',
              ].map(item => (
                <div className="kyc-check" key={item}>
                  <MdOutlineVerified className="kyc-check-icon" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            {/* <Link to="/register" className="btn btn-primary">
              Apply to Become a Verified Agent <FiArrowRight />
            </Link> */}
            <button className="btn btn-primary" onClick={() => navigate('/register')}>
              Apply to Become an Agent <FiArrowRight />
            </button>
          </div>
        </div>
      </section>

{/* Import CTA Banner */}
      <CtaBanner 
        title = "Ready to find your home - the right way?"
        subtitle = "Join thousands of property seekers and verified agents who trust VenloRent to get the deal done."
        buttons = {[
          { href: "/register", name: "Create Free Account", style: "white" },
          { href: "/login", name: "I have an account", style: "outline-white" }
        ]}
      />
      
      {/* Import Footer */}
      <PrelimFooter />
    </div>
  )
}

export default AboutPage