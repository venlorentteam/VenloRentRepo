import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { LandingPageHeader, PrelimFooter } from '../exports'
import '../assets/css/global.css'
import { FiUser, FiHome, FiCreditCard, FiShield, FiMessageSquare, FiChevronDown, FiChevronUp, FiHelpCircle, FiLifeBuoy, FiMail } from 'react-icons/fi'
import { MdOutlineVerified } from "react-icons/md";
import './PrelimHelp.css'

const FAQ_ITEMS = [
  {
    id: 'unverified-vs-verified',
    q: 'What is the difference between an unverified account and a verified account?',
    a: [
      'All new accounts start as Unverified. Unverified users can browse listings, search for properties, view agent profiles, post property requests, and follow agents, but cannot send messages, place orders, or make payments.',
      'To unlock full platform features, you need to become either a Verified House Seeker (basic identity verification) or a Verified Agent (full KYC including identity and business documents). Verification helps protect users from interacting with unaccountable individuals.',
    ],
  },
  {
    id: 'verified-agent',
    q: 'How do I become a verified agent on VenloRent?',
    a: [
      'Go to Settings -> Verification -> Become an Agent. You will be asked to upload a government-issued photo ID (passport, national identity card, or driver\'s license), proof of your real estate business activity, and optionally a professional headshot. You will also provide your business name, office address, and years of experience.',
      'Our team manually reviews every KYC submission. The process typically takes 24-48 hours. You will receive an email when approved or rejected, and if rejected you will receive feedback on what needs to be corrected before resubmitting.',
    ],
  },
  {
    id: 'reservation-window',
    q: 'How exactly does the 3-day reservation system work?',
    a: [
      'When you place an order on a listing, the property is reserved exclusively for you for 72 hours. The listing is immediately hidden from the public feed so no other user can place an order during that window.',
      'This window is for arranging and completing an in-person inspection. If payment is not made within 72 hours, you will receive a reminder at the 48-hour mark and the order is automatically canceled at hour 72, returning the listing to the feed. You may hold up to 3 active orders at once.',
    ],
  },
  {
    id: 'fees',
    q: 'What fees will I pay on VenloRent?',
    a: [
      'VenloRent charges a flat 2% service fee on each completed transaction. This is added to the rent or purchase amount and the agent\'s listed commission. You will see the full itemized payment breakdown before confirming payment.',
      'For agents, creating and managing listings is free. Boost Listing is optional and paid. Boost options and pricing are shown in-app, and boost fees are non-refundable once activated.',
    ],
  },
  {
    id: 'cancel-order',
    q: 'Can I cancel an order after placing it?',
    a: [
      'Yes. You can cancel any order before payment is made. Open your Orders page, select the order, and tap "Cancel Order." You may optionally provide a cancellation reason. The listing returns to Available and the agent is notified.',
      'Once payment has been confirmed, cancellations must be handled through support at support@venlorent.com because the case may involve payment dispute procedures.',
    ],
  },
  {
    id: 'cannot-message',
    q: 'Why can\'t I send a message to an agent?',
    a: [
      'Messaging requires a verified account. If you see a verification prompt, complete verification from Settings -> Verification first.',
      'Messaging is structured: you can message agents whose listings you are viewing or have placed an order on. Agents can reply to you, or initiate contact with users who posted a public Property Request.',
    ],
  },
  {
    id: 'phone-numbers-in-chat',
    q: 'Why am I not allowed to share my phone number in messages?',
    a: [
      'Sharing personal contact details in messages is prohibited because it moves transactions off-platform and removes key safety protections.',
      'Messages containing phone numbers or external links may be automatically flagged and reviewed by the trust and safety team.',
    ],
  },
  {
    id: 'report-fraud',
    q: 'How do I report a suspicious listing or a fraudulent agent?',
    a: [
      'On a listing, open the three-dot menu and select "Report Listing." On an agent profile, select "Report Agent." Submit a short description and the trust and safety team reviews reports quickly.',
      'If you have already lost money, email security@venlorent.com immediately with supporting details such as screenshots, order details, and payment evidence.',
    ],
  },
  {
    id: 'delete-data',
    q: 'What happens to my data if I delete my VenloRent account?',
    a: [
      'When deletion is requested, your account is immediately deactivated. Listings are unpublished and your profile is no longer visible.',
      'Personal data is permanently deleted after 30 days. Payment and transaction records may be retained in a restricted archive for 7 years to satisfy financial compliance requirements.',
    ],
  },
  {
    id: 'global-availability',
    q: 'Is VenloRent available outside Nigeria?',
    a: [
      'Yes. VenloRent is a global platform and supports users across countries. Agent KYC accepts government-issued identity documents from any jurisdiction.',
      'Payment method availability may vary by region based on provider coverage. Contact support@venlorent.com if you run into a payment limitation.',
    ],
  },
  {
    id: 'boost-listing',
    q: 'As an agent, how do I boost a listing?',
    a: [
      'From your agent dashboard, open the listing and tap "Boost." Select duration, review cost, and complete payment in-app. The listing is promoted with a boosted badge.',
      'You can boost multiple listings at once. Boost fees are non-refundable once activated.',
    ],
  },
  {
    id: 'property-requests',
    q: 'How do property requests work, and what are the rules?',
    a: [
      'Property Requests allow seekers to post what they need, including type, budget range, location, move-in date, and bedroom count. Verified agents can respond publicly or message the poster.',
      'Requests must not include phone numbers, URLs, or anything resembling an agent listing. Requests are limited to 2 per user per week and auto-expire after 30 days of inactivity.',
    ],
  },
]

const HELP_TOPICS = [
  {
    title: 'Live Chat',
    description: 'Available in-app for verified users. Tap the chat icon in the bottom-right corner.',
  },
  {
    title: 'Documentation',
    description: 'Full platform guides and API reference at docs.venlorent.com',
  },
  {
    title: 'Community',
    description: 'Questions and shared experiences at community.venlorent.com',
  },
  {
    title: 'Report Fraud',
    description: 'Lost money to a scam? Email security@venlorent.com immediately with evidence.',
  },
]

const cardList = [
    {
      title: 'Getting Started',
      description: 'Sign up, verify your account, and explore the platform for the first time.',
      icon: <FiUser />
    },
    {
      title: 'Listings & Requests',
      description: 'Placing orders, the 3-day reservation system, inspections, and secure payment.',
      icon: <FiHome />
    },
    {
      title: 'Orders & Payments',
      description: 'Reservation flow, order statuses, and evidence handling.',
      icon: <FiCreditCard />
    },
    {
      title: 'Agent Verification',
      description: 'KYC documents required, submission process, timelines, and resubmission.',
      icon: <MdOutlineVerified />
    },
    {
        title: 'Messaging Rules',
        description: 'Guidelines for communicating with other users on the platform.',
        icon: <FiMessageSquare />
    }, 
    {
      title: 'Safety & Fraud',
      description: 'Spotting scams, reporting fraudulent agents or listings, and staying safe.',
      icon: <FiShield />
    }
  ]
const PrelimHelp = () => {
  const [openItem, setOpenItem] = useState(null)
  const [query, setQuery] = useState('')

  const filteredFaq = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return FAQ_ITEMS
    return FAQ_ITEMS.filter((item) => {
      const answerText = item.a.join(' ').toLowerCase()
      return item.q.toLowerCase().includes(term) || answerText.includes(term)
    })
  }, [query])

  return (
    <div className="help-page">
      <LandingPageHeader />

      <main className="help-main">
        <section className="help-hero card">
          <span className="help-eyebrow">
            <FiLifeBuoy />
            Help Center
          </span>
          <h1>How can we help?</h1>
          <p>
            Find product guidance, policy references, and support channels for using VenloRent.
          </p>
          <label className="help-search-wrap" htmlFor="help-search">
            <FiHelpCircle />
            <input
              id="help-search"
              className="help-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search help topics..."
            />
          </label>
        </section>
        {/* List the FAQ items */}
        <section className="help-grid">
          <article className="help-faq card">
            <h2>Frequently Asked Questions</h2>
            {filteredFaq.length === 0 ? (
              <p className="help-empty">No matching topics found. Try another keyword.</p>
            ) : (
              <div className="faq-list">
                {filteredFaq.map((item) => {
                  const isOpen = openItem === item.id
                  return (
                    <div key={item.id} className={`faq-item ${isOpen ? 'open' : ''}`}>
                      <button
                        type="button"
                        className="faq-btn"
                        onClick={() => setOpenItem(isOpen ? null : item.id)}
                      >
                        <span>{item.q}</span>
                        {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                      </button>
                      {isOpen && (
                        <div className="faq-body">
                          {item.a.map((paragraph, index) => (
                            <p key={`${item.id}-${index}`}>{paragraph}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </article>

          <aside className="help-side">
            <section className="help-topics card">
              <h2>Top Categories</h2>
              <ul>
                {HELP_TOPICS.map((topic) => (
                  <li key={topic.title}>
                    <h3>{topic.title}</h3>
                    <p>{topic.description}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="help-contact card">
              <h2>Need direct support?</h2>
              <p>
                Our support team can help with account, policy, and platform troubleshooting.
              </p>
              <a className="btn btn-primary" href="mailto:support@venlorent.com">
                <FiMail />
                Contact Support
              </a>
              <div className="help-links">
                <Link to="/terms">Terms of Service</Link>
                <Link to="/privacy-policy">Privacy Policy</Link>
              </div>
            </section>
          </aside>
        </section>
        <div className="help-card-container">
            {cardList.map((card) => (
                <div key={card.title} className="help-card-item card">
                    <div className="help-icon">{card.icon}</div>
                    <h2>{card.title}</h2>
                    <p>{card.description}</p>
                </div>
            ))}
        </div>
      </main>

      <PrelimFooter />
    </div>
  )
}

export default PrelimHelp
