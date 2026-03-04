import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LandingPageHeader, PrelimFooter } from '../exports'
import '../assets/css/global.css'
import { FiLock, FiShield } from 'react-icons/fi'
import './PrivacyPolicy.css'

const PERSONAL_DATA_ROWS = [
  {
    category: 'Identity & Account Data',
    points: 'Full name, email address, phone number, profile photo, password (stored as bcrypt hash and never readable).',
    collection: 'Provided by you at registration or profile edit.',
    requirement: 'Required',
  },
  {
    category: 'KYC Documents',
    points: 'Government-issued ID, proof of business, professional headshot, business name and address.',
    collection: 'Uploaded by you during the agent verification process.',
    requirement: 'Agents only',
  },
  {
    category: 'Listing & Request Content',
    points: 'Property photos, descriptions, pricing, location, house type, availability status; request descriptions and budget ranges.',
    collection: 'Created by you when posting listings or requests.',
    requirement: 'Posting users',
  },
  {
    category: 'Transaction & Order Data',
    points: 'Order history, order status, payment amounts, payment method type, transaction reference numbers, payment receipts.',
    collection: 'Generated when orders are placed or payment workflows are used.',
    requirement: 'Required',
  },
  {
    category: 'Message Content',
    points: 'Text content of in-app messages between users and agents.',
    collection: 'You send this through the in-app messaging system.',
    requirement: 'As needed',
  },
  {
    category: 'Usage & Behavioural Data',
    points: 'Pages visited, listings viewed, search terms used, filters applied, session duration, follow actions.',
    collection: 'Automatically collected through platform analytics and diagnostics.',
    requirement: 'Opt-out',
  },
  {
    category: 'Device & Technical Data',
    points: 'IP address, browser type and version, operating system, timezone, referring URL.',
    collection: 'Automatically collected for fraud prevention, reliability, and security.',
    requirement: 'Opt-out',
  },
  {
    category: 'Support Communications',
    points: 'Emails, support tickets, and attachments sent to support teams.',
    collection: 'Provided by you when contacting VenloRent support.',
    requirement: 'As needed',
  },
]

const getRequirementClass = (requirement) => {
  return requirement === 'Required' || requirement === 'Agents only' || requirement === 'Posting users'
    ? 'badge badge-gold'
    : 'badge badge-gray'
}

const PROCESSING_PURPOSE_ROWS = [
  {
    purpose: 'Creating and managing your account',
    categories: 'Identity and account data',
    legalBasis: 'Contract performance',
  },
  {
    purpose: 'KYC review and agent verification',
    categories: 'KYC documents, identity data',
    legalBasis: 'Contract performance; Legal obligation',
  },
  {
    purpose: 'Enabling listings, orders, and payments',
    categories: 'Identity, listing, transaction data',
    legalBasis: 'Contract performance',
  },
  {
    purpose: 'Operating the in-app messaging system',
    categories: 'Message content, identity data',
    legalBasis: 'Contract performance',
  },
  {
    purpose: 'Fraud detection, platform safety, and trust enforcement',
    categories: 'Device data, usage data, message flags',
    legalBasis: 'Legitimate interest',
  },
  {
    purpose: 'Platform analytics and product improvement',
    categories: 'Anonymized usage data',
    legalBasis: 'Legitimate interest (anonymized, cannot identify you)',
  },
  {
    purpose: 'Sending transactional emails (receipts, order updates, verification outcomes)',
    categories: 'Email address, transaction data',
    legalBasis: 'Contract performance',
  },
  {
    purpose: 'Sending marketing and promotional communications',
    categories: 'Email address, usage data',
    legalBasis: 'Your explicit consent (opt-in only; you may withdraw at any time)',
  },
  {
    purpose: 'Legal compliance and dispute resolution',
    categories: 'All relevant data, retained per legal obligation',
    legalBasis: 'Legal obligation',
  },
  {
    purpose: 'Feed personalization and relevance ranking',
    categories: 'Anonymized search and view history',
    legalBasis: 'Legitimate interest',
  },
]

const PRIVACY_RIGHT_ROWS = [
  {
    right: 'Access',
    meaning: 'Request a copy of all personal data we hold about you',
    exercise: 'Settings -> Privacy -> Export Data, or email {privacyEmail}',
    responseTime: '30 days',
  },
  {
    right: 'Rectification',
    meaning: 'Correct any inaccurate or incomplete personal data',
    exercise: 'Edit Profile in-app, or contact support',
    responseTime: '14 days',
  },
  {
    right: 'Erasure',
    meaning: 'Request permanent deletion of your account and personal data',
    exercise: 'Email {privacyEmail}',
    responseTime: '30 days',
  },
  {
    right: 'Portability',
    meaning: 'Receive your data in a structured, machine-readable format (JSON / CSV)',
    exercise: 'Settings -> Privacy -> Export Data',
    responseTime: '30 days',
  },
  {
    right: 'Restriction',
    meaning: 'Request we restrict processing of your data while a dispute is under review',
    exercise: 'Email {privacyEmail}',
    responseTime: '30 days',
  },
  {
    right: 'Objection',
    meaning: 'Object to processing carried out on legitimate interest grounds',
    exercise: 'Email {privacyEmail}',
    responseTime: '30 days',
  },
  {
    right: 'Withdraw Consent',
    meaning: 'Withdraw consent for marketing emails at any time, with immediate effect',
    exercise: 'Unsubscribe link in any email, or Settings -> Notifications',
    responseTime: 'Immediate',
  },
  {
    right: 'CCPA Opt-Out',
    meaning: 'California residents: opt out of sale of personal information (we do not sell data; this is a standing right)',
    exercise: 'Settings -> Privacy',
    responseTime: 'Immediate',
  },
]

const COOKIE_ROWS = [
  {
    type: 'Essential',
    typeBadge: 'badge badge-green',
    purpose: 'Required for core platform functionality: user authentication, session management, and CSRF protection. Disabling these will prevent login.',
    examples: 'Session ID, auth token, CSRF token',
    canOptOut: 'No - required',
    optOutBadge: 'badge badge-red',
  },
  {
    type: 'Preference',
    typeBadge: 'badge badge-gold',
    purpose: 'Stores your personalized settings such as feed filter preferences and UI preferences across sessions.',
    examples: 'Filter state, UI preferences',
    canOptOut: 'Yes',
    optOutBadge: 'badge badge-green',
  },
  {
    type: 'Analytics',
    typeBadge: 'badge badge-gray',
    purpose: 'Aggregate, anonymized usage data to understand how the platform is used. Data is processed in a way that cannot identify individuals.',
    examples: 'Page views, feature usage events',
    canOptOut: 'Yes',
    optOutBadge: 'badge badge-green',
  },
  {
    type: 'Marketing',
    typeBadge: 'badge badge-red',
    purpose: 'VenloRent does not use marketing or advertising cookies. We do not serve or facilitate third-party advertising on the platform.',
    examples: 'None - not in use',
    canOptOut: 'N/A',
    optOutBadge: 'badge badge-gray',
  },
]

const PrivacyPolicy = () => {
  const updatedAt = 'March 2, 2026'
  const privacyEmail = 'privacy@venlorent.com';
  useEffect(() => {
    document.title = "Privacy Policy - VenloRent"
  }, []);

  return (
    <div className="legal-page privacy-page">
      <LandingPageHeader />

      <main className="legal-main">
        <section className="legal-hero">
          <span className="legal-eyebrow">
            <FiLock />
            Privacy
          </span>
          <h1>Privacy Policy</h1>
          <p>
            We take your privacy seriously. This Policy tells you exactly what personal data VenloRent collects, why we collect it, how it is protected, and the rights you hold over it, wherever in the world you are based.
          </p>
          <div className="legal-meta">
            <span>Last updated: {updatedAt}</span>
            <span>Applies globally</span>
          </div>
        </section>
        <div className="disclaimer">
          <strong>Our Core Privacy Commitments:</strong> We do not sell your personal data to any third party. We do not share your data with advertisers. 
          We do not use your messages or listing content to train AI or machine learning models. <br/>
          You can export a copy of your data or request full deletion at any time by contacting <strong>support@venlorent.com</strong>.
        </div>
        <section className="legal-layout">
          <aside className="legal-toc card">
            <h2>Contents</h2>
            <a href="#data">1. Personal Data</a>
            <a href="#process-data">2. Why We Process Data</a>
            <a href="#share-data">3. How We Share Data</a>
            <a href="#privacy">4. Your Privacy</a>
            <a href="#cookies">5. Cookies & Tracking</a>
            <a href="#security">6. Security & Retention</a>
            <a href="#data-controller">7. Data Controller</a>
          </aside>

          <article className="legal-content card">
            <section id="data">
              <h2>1. Personal Data We Collect</h2>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Specific Data Points</th>
                        <th>How Collected</th>
                        <th>Required?</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PERSONAL_DATA_ROWS.map((row) => (
                        <tr key={row.category}>
                          <td><strong>{row.category}</strong></td>
                          <td>{row.points}</td>
                          <td>{row.collection}</td>
                          <td>
                            <span className={getRequirementClass(row.requirement)}>
                              {row.requirement}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div> 
                
              <p>
                VenloRent does not intentionally collect sensitive special-category 
                data such as racial or ethnic origin, political opinions, religious beliefs, health data, biometric data, or full financial account credentials. Full payment card details are processed exclusively by our certified payment providers and are never stored on VenloRent's servers.
              </p>
            </section>

            <section id="process-data">
              <h2>2. Why We Process Data</h2>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Processing Purpose</th>
                      <th>Data Categories Used</th>
                      <th>Legal Basis</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PROCESSING_PURPOSE_ROWS.map((row) => (
                      <tr key={row.purpose}>
                        <td>{row.purpose}</td>
                        <td>{row.categories}</td>
                        <td>{row.legalBasis}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section id="share-data">
              <h2>3. How We Share Your Data</h2>
              <p>
                VenloRent does not sell, rent, or trade your personal data. We share data only in the following limited and controlled circumstances:
              </p>
              <div className="callout quote">
                <h2>Trusted Service Providers (Sub-processors)</h2>
                <p>
                  We engage trusted third-party service providers who process data solely on our behalf, under strict data processing agreements that prohibit 
                  any independent use of your data. Current sub-processors include: Cloudinary (image and document storage), Flutterwave / Paystack (payment processing, PCI-DSS certified), 
                  SendGrid / Mailgun (transactional email delivery), MongoDB Atlas (database hosting), and Vercel / Render / Railway (application hosting infrastructure).
                </p>
              </div>
              <div className="callout quote">
                <h2>Between Platform Users (Limited Public Profile Data)</h2>
                <p>
                    Certain profile information is visible to other users as part of normal platform operation. This includes: your display name, avatar, verification status, bio, join date, and 
                    (for agents) listing count and completed order count. Your email address, phone number, and KYC documents are never made visible to other users under any circumstances.
                </p>
              </div>
              <div className="callout quote">
                <h2>Legal and Regulatory Disclosure</h2>
                <p>
                  We may disclose your data where required by law, court order, or valid demand from a governmental or regulatory authority. Where legally permitted to do so, we will attempt to notify you in advance of any such disclosure
                </p>
              </div>
              <div className="callout quote">
                <h2>Business Transfers</h2>
                <p>
                    If VenloRent undergoes a merger, acquisition, or sale of all or substantially all of its assets, user data may be transferred to the acquiring entity. <br/>
                    We will provide at least 30 days' advance notice by email before the transfer takes place. You may request deletion of your data before the transfer is completed.
                </p>
              </div>
            </section>

            <section id="privacy">
              <h2>4. Your Privacy Right</h2>
              <p>VenloRent respects your rights over your personal data. The following rights apply to all users, regardless of country:</p>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Right</th>
                      <th>What It Means</th>
                      <th>How to Exercise It</th>
                      <th>Response Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRIVACY_RIGHT_ROWS.map((row) => (
                      <tr key={row.right}>
                        <td><span className="badge badge-green">{row.right}</span></td>
                        <td>{row.meaning}</td>
                        <td>{row.exercise}</td>
                        <td>{row.responseTime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="callout info">
                <p>
                  Some data — particularly payment and transaction records — must be retained for up to 7 years after account deletion to satisfy financial regulatory obligations in applicable jurisdictions. 
                  Such retained data is held in a restricted archive and is not used for any product, marketing, or analytical purpose.
                </p>
              </div>
            </section>

            <section id="cookies">
              <h2>5. Cookies & Tracking Technologies</h2>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Cookie Type</th>
                      <th>Purpose</th>
                      <th>Examples</th>
                      <th>Can You Opt Out?</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COOKIE_ROWS.map((row) => (
                      <tr key={row.type}>
                        <td><span className={row.typeBadge}>{row.type}</span></td>
                        <td>{row.purpose}</td>
                        <td>{row.examples}</td>
                        <td><span className={row.optOutBadge}>{row.canOptOut}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section id="security">
              <h2>6. Security, Retention & International Transfers</h2>
              <div className="callout quote">
                <h2>Security Measures</h2>
                <p>
                  All data transmitted between your device and VenloRent is encrypted in transit using TLS 1.2 or higher. Stored data is encrypted at rest. Passwords are hashed using bcrypt and are never stored in readable form. 
                  <br/>
                  KYC documents are stored with access controls on Cloudinary. Authentication sessions use signed JWT tokens. 
                  <br/><br/>
                  We maintain rate limiting to prevent automated abuse. We operate a responsible disclosure channel for security researchers at <strong>{privacyEmail}</strong>.
                </p>
              </div>

              <div className="callout quote">
                <h2>Data Retention Schedule</h2>
                <p>
                  Active account data is retained for as long as your account remains open. Upon account deletion: your personal data is soft-deleted immediately and permanently erased after 30 days (GDPR-aligned). 
                  Message history is retained for 12 months from last conversation activity, then automatically purged. 
                  Payment and transaction records are retained for 7 years to comply with applicable financial recordkeeping laws. Anonymised and aggregated analytics data may be retained indefinitely, as it is not attributable to any individual.
                </p>
              </div>
                  
              <div className="callout quote">
                <h2>International Data Transfers</h2>
                <p>
                  As a global platform, VenloRent may process your data in countries other than your country of residence, including the United States and European Economic Area member states. 
                  Where personal data is transferred from the EEA or UK to a third country, we rely on appropriate transfer mechanisms, including Standard Contractual Clauses (SCCs) approved by the European Commission, or adequacy decisions where applicable. 
                  We do not transfer data to jurisdictions that lack adequate protection without first implementing appropriate safeguards.
                </p>
              </div>
            </section>

            <section id="data-controller">
              <h2>7. Data Controller & How to Contact Us</h2>
              <p>VenloRent Incorporated is the Data Controller for all personal data processed through the platform. For privacy enquiries, to exercise your rights, or to raise a concern:</p>
              <ul>
                <li><strong>Disclosures:</strong> {privacyEmail}</li>
              </ul>
              <div className="callout quote">
                <p>
                  If you are not satisfied with our response, you have the right to lodge a complaint with the data protection supervisory authority in your jurisdiction (for example,  Nigeria Data Protection Commission (NDPC)).
                </p>
              </div>
            </section>
          </article>
        </section>

        <section className="legal-cta card">
          <h2>Your privacy choices matter</h2>
          <p>Need account data support or legal clarification?</p>
          <div className="legal-cta-actions">
            <a className="btn btn-primary" href={`mailto:${privacyEmail}`}>
              <FiShield />
              Contact Privacy Team
            </a>
            <Link to="/terms" className="btn btn-secondary">
              View Terms
            </Link>
          </div>
        </section>
      </main>

      <PrelimFooter />
    </div>
  )
}

export default PrivacyPolicy
