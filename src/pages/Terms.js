import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LandingPageHeader, PrelimFooter } from '../exports'
import '../assets/css/global.css'
import { FiCheckCircle, FiFileText } from 'react-icons/fi'
import './Terms.css'

const ROLE_PERMISSION_ROWS = [
  { capability: 'Browse listings & requests', unverified: true, seeker: true, agent: true },
  { capability: 'Search & filter properties', unverified: true, seeker: true, agent: true },
  { capability: 'View agent profiles', unverified: true, seeker: true, agent: true },
  { capability: 'Post property requests', unverified: true, seeker: true, agent: true },
  { capability: 'Follow agents', unverified: true, seeker: true, agent: true },
  { capability: 'Send messages to agents', unverified: false, seeker: true, agent: true },
  { capability: 'Place orders on listings', unverified: false, seeker: true, agent: true },
  { capability: 'Make payments', unverified: false, seeker: true, agent: true },
  { capability: 'Save favourite listings', unverified: false, seeker: true, agent: true },
  { capability: 'Create property listings', unverified: false, seeker: false, agent: true },
  { capability: 'Edit/delete own listings', unverified: false, seeker: false, agent: true },
  { capability: 'Boost listings (paid feature)', unverified: false, seeker: false, agent: true },
  { capability: 'Mark orders as complete', unverified: false, seeker: false, agent: true },
  { capability: 'Initiate first contact', unverified: false, seeker: true, agent: 'Reply-only*' },
]

const renderPermission = (value) => {
  if (value === true) return <span className="perm-check">{"\u2713"}</span>
  if (value === false) return <span className="perm-cross">{"\u2717"}</span>
  return value
}

const Terms = () => {
  const updatedAt = 'March 2, 2026'
  const legalEmail = 'legal@venlorent.com'
  useEffect(() => {
    document.title = "Terms & Conditions - VenloRent"
  }, [])

  return (
    <div className="legal-page terms-page">
      <LandingPageHeader />

      <main className="legal-main">
        <section className="legal-hero">
          <span className="legal-eyebrow">
            <FiFileText />
            Legal
          </span>
          <h1>Terms & Conditions</h1>
          <p>
            By registering an account, browsing listings, posting a property request, placing an order, 
            or making any payment through VenloRent, you confirm that you have read, understood, and agree to be legally bound by these Terms and our Privacy Policy in their entirety.
          </p>
          <div className="legal-meta">
            <span>Last updated: {updatedAt}</span>
            <span>Version: 1.0</span>
          </div>
        </section>
        <div className="disclaimer">
          <strong>Important Notice:</strong> VenloRent is a technology marketplace platform, not a real estate agency. We do not buy, sell, rent, or manage any property. All transactions occur directly between users and verified agents. Nothing in these Terms constitutes legal, financial, or property investment advice. You are encouraged to seek independent professional advice before entering into any real estate transaction.
        </div>
        <section className="legal-layout">
          <aside className="legal-toc card">
            <h2>Contents</h2>
            <a href="#acceptance">1. Acceptance</a>
            <a href="#platform">2. The Platform</a>
            <a href="#registration">3. Account Registration</a>
            <a href="#roles">4. Roles & Permissions</a>
            <a href="#kyc">5. KYC Verification</a>
            <a href="#property">6. Listings & Requests</a>
            <a href="#orders">7. Orders & Inspections</a>
            <a href="#payment">8. Payment</a>
            <a href="#messaging">9. Communication Rules</a>
            <a href="#contact">10. Conduct</a>
            <a href="#intellectual-property">11. Intellectual Property</a>
            <a href="#disclaimers">12. Disclaimers</a>
            <a href="#termination">13. Termination & Suspension</a>
            <a href="#law">14. Dispute Resolution</a>
            <a href="#changes">15. Changes</a>
          </aside>

          <article className="legal-content card">
            <section id="acceptance">
              <h2>1. Acceptance</h2>
              <div className="callout info">
                <span className="callout-icon">📋</span>
                <p>By registering an account, browsing listings, posting a property request, placing an order, or making any payment through VenloRent, you confirm that you have read, understood, and agree to be legally bound by these Terms and our Privacy Policy in their entirety.</p>
              </div>
              <p>
                These Terms constitute a binding legal agreement between you ("User," "you," "your") and VenloRent Incorporated ("VenloRent," "we," "us," "our"). 
                If you access VenloRent on behalf of a company or other legal entity, you represent that you have the authority to bind that entity to these Terms. If you do not agree, you must discontinue use of the platform immediately.
              </p>
            </section>

            <section id="platform">
              <h2>2. The Platform</h2>
              <p>
                VenloRent is a global online real estate marketplace that connects house seekers with verified property agents. The platform enables listing discovery, agent-seeker communication, inspection coordination, and secure payment processing — all within a single, structured environment.
                <br/>
                VenloRent operates a dual posting system: agents post Property Listings (supply) and seekers post Property Requests (demand), enabling a true two-way marketplace. VenloRent acts solely as a technology intermediary. We are not a party to any transaction, do not own or manage any property, and do not guarantee the accuracy, legality, or suitability of any listing.
              </p>
            </section>

            <section id="registration">
              <h2>3. Account Registration & Eligibility</h2>
              <p>
                To access VenloRent's core features, you must create an account using a valid email address and password. By registering, you represent and warrant that:
              </p>
              <div className="callout quote">
                <h2>Eligibility Requirements</h2>
                <p>
                  You are at least <strong>18 years of age</strong>, or the applicable age of majority in your jurisdiction. 
                  <br/>
                  You will provide accurate, complete, and current registration information including your full legal name, email address, and phone number. You will not create more than one account or create an account on behalf of another person without their explicit consent. You will maintain the confidentiality of your login credentials and not share account access with any third party. You will notify VenloRent immediately at <strong>support@venlorent.com</strong> if you suspect unauthorised access to your account.
                </p>
              </div>
              <p>Accounts are personal and non-transferable. All new accounts are created with Unverified User status by default and have limited access until verification is completed. Sessions persist for 3 days from login.</p>
              <div className="callout warn">
                <p>VenloRent reserves the right to reject any registration or suspend or terminate any account at its sole discretion, with or without prior notice, where it believes these Terms have been violated or platform integrity is at risk.</p>
              </div>
            </section>

            <section id="roles">
              <h2>4. Roles & Permissions</h2>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Capability</th>
                      <th>Unverified User</th>
                      <th>Verified Seeker</th>
                      <th>Verified Agent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ROLE_PERMISSION_ROWS.map((row) => (
                      <tr key={row.capability}>
                        <td>{row.capability}</td>
                        <td>{renderPermission(row.unverified)}</td>
                        <td>{renderPermission(row.seeker)}</td>
                        <td>{renderPermission(row.agent)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section id="kyc">
              <h2>5. Agent KYC Verification</h2>
              <p>
                To become a Verified Agent, users must complete VenloRent's Know Your Customer (KYC) process, which involves manual review of identity and business documentation by the VenloRent team. KYC review targets a turnaround of 24–48 hours.
              </p>
              <div className="callout quote">
                <h2>Documents Required for KYC</h2>
                <p>A valid government-issued photo identification document (passport, national identity card, or driver's licence from any jurisdiction). 
                  <br/>
                  Proof of real estate business activity, such as a business registration certificate, professional association membership, or documented evidence of active practice. A professional headshot photograph (optional but recommended). 
                  <br/>
                  Your business or trading name, operational address, and stated years of experience.</p>
              </div>
              <div className="callout quote">
                <h2>Documents Standards</h2>
                <p>
                  Submissions must be legible, unedited, and unexpired. Accepted file formats are JPG, PNG, and PDF. Maximum file size is 5MB per document. Documents are stored securely and handled in accordance with our Privacy Policy. 
                  <br/>
                  Submitting falsified, altered, or misleading documents is a material breach of these Terms and may result in permanent account termination and referral to appropriate law enforcement authorities.
                </p>
              </div>
              <div className="callout warn">
                <p>
                    VenloRent's KYC process verifies identity and business legitimacy, it does not verify the ownership, legal status, or physical condition of any property. 
                    Approval of KYC does not constitute an endorsement of any agent's professional competence, listings, or business conduct.
                </p>
              </div>
              <p>
                If your KYC application is rejected, you will receive feedback and may resubmit corrected documentation. VenloRent reserves the right to reject any KYC application without further obligation.
              </p>
            </section>

            <section id="property">
              <h2>6. Property Listings & Property Requests</h2>
              <p>
                <strong>Property Listings</strong> may only be created by Verified Agents. By creating a listing, an agent warrants that: the property exists and is accurately described; all photographs are genuine and current; all pricing (including stated commissions) is accurate and complete; and the agent has lawful authority or proper mandate from the property owner to list the property.
                    <br/><br/>
                Listing availability is governed by status: "Available" listings appear in the feed and search; "Reserved" listings (subject to an active order) are hidden from the feed; "Sold/Rented" listings are removed from discovery. Agents are responsible for keeping availability status accurate at all times.
                    <br/><br/>
                <strong>Property Requests</strong> may be posted by any registered user, verified or not. Requests are demand-side posts describing what a seeker is looking for — they must not function as property listings. Requests may not contain property addresses, telephone numbers, external URLs, or content resembling an agent advertisement. Requests are rate-limited to two per user per week and automatically expire after 30 days of inactivity.
              </p>
              <div className="disclaimer">
                VenloRent reserves the right to remove any listing or request at any time that violates these Terms, is flagged as fraudulent or misleading, or is inconsistent with platform standards — without prior notice or compensation to the posting user.
              </div>
            </section>

            <section id="orders">
              <h2>7. Orders, Inspections & the 3-Day Reservation System</h2>
              <p>
                When a Verified User places an order on an available listing, that property is <strong>automatically reserved exclusively for that user for 72 hours (3 calendar days).</strong> 
                During this period the listing is removed from the public feed. This window is intended for the user to complete an in-person inspection and decide whether to proceed with payment.
                <br/><br/>
                If payment is not received within 72 hours, the system sends a reminder at the 48-hour mark and automatically cancels the order at 72 hours, returning the listing to "Available" status in the feed. Users may hold a maximum of <strong>3 active orders simultaneously.</strong> 
                After completing payment, the agent is responsible for marking the order as "Completed," at which point the user may submit a rating and review.
              </p>
              <div className="callout warn">
                <p>
                  VenloRent does not guarantee the physical condition, legal title, or suitability of any property. The reservation system does not constitute a binding contract between the user and agent, 
                  that is formed at the point of payment. Users are strongly advised to inspect properties and seek independent legal advice before paying.
                </p>
              </div>
            </section>

            <section id="payment">
              <h2>8. Payment & Fees</h2>
              <p>
                All payments on VenloRent are processed through integrated third-party payment providers. 
                By making a payment, you additionally agree to the terms and privacy policies of those providers (currently Flutterwave and/or Paystack). Available payment methods may vary by region.
              </p>
              <div className="callout quote">
                <h2>What You Pay</h2>
                <p>
                  Every transaction on VenloRent includes the <strong>Base Rent or Purchase Amount</strong> as listed by the agent, the <strong>Agent Commission</strong> as disclosed in the listing at the time of order, 
                  and a <strong>VenloRent Service Fee of 2%</strong> of the total transaction amount. The complete payment breakdown is always presented for your review and approval before any payment is confirmed. There are no additional hidden charges.
                </p>
              </div>
              <div className="callout quote">
                <h2>Boost Listing Fees</h2>
                <p>
                  Agents may optionally pay to boost listings for increased feed visibility. 
                  Boost options and pricing are displayed in-app at the time of purchase. Boost fees are non-refundable once a boost is activated, regardless of listing performance or removal.
                </p>
              </div>
              <p>
                In the MVP phase, payments flow directly from the user to the agent (peer-to-peer). An <strong>escrow model</strong> where VenloRent holds funds until order completion is planned for a future release. 
                <br/>
                VenloRent expressly disclaims liability for funds transmitted directly to agents, including in cases of fraud or non-performance. Payment disputes should be raised at <strong>disputes@venlorent.com</strong>. Failed payments do not cancel your order; the reservation countdown continues and you may retry.
              </p>
            </section>

            <section id="messaging">
              <h2>9. Messaging & Communication Rules</h2>
              <p>
                VenloRent provides an in-app messaging system to facilitate structured communication between seekers and agents. All messages are subject to automated moderation and may be reviewed by our trust and safety team. By using messaging, you agree to the following:
              </p>
              <div className="callout quote">
                <h2>Prohibited Message Content</h2>
                <p>
                  Personal phone numbers, WhatsApp handles, Telegram usernames, or any other off-platform contact details. 
                  Links to external websites, social media, or third-party platforms. Payment requests or banking details outside the VenloRent payment flow. 
                  Offensive, harassing, threatening, discriminatory, or defamatory content. Any content intended to circumvent VenloRent's platform for a property transaction.
                </p>
              </div>
              <p>
                Messages containing flagged content are automatically held for review and may result in account suspension. A rate limit of 50 messages per conversation per day applies. Users may report conversations for spam or abuse via the in-app report function.
              </p>
              <div className="callout warn">
                <p>
                  Soliciting or agreeing to conduct real estate transactions outside of VenloRent — including for the purpose of avoiding the platform service fee — is a serious breach of these Terms and may result in permanent termination of your account.
                </p>
              </div>
            </section>

            <section id="contact">
              <h2>10. Conduct</h2>
              <p>
               The following are strictly prohibited on VenloRent and may result in immediate account termination, content removal, and referral to law enforcement:
              </p>
              <div className="callout quote">
                <p>
                  Posting fraudulent, misleading, or fabricated property listings or requests. Impersonating any person, agent, company, or VenloRent staff member. Submitting falsified, altered, or expired KYC documents. Scraping, crawling, or automated data extraction from the platform without prior written consent from VenloRent. 
                  Attempting to reverse-engineer, decompile, or exploit any part of the platform's software or infrastructure. Using the platform for money laundering, property fraud, or any other illegal purpose. Creating multiple accounts to circumvent suspensions, bans, rate limits, or verification requirements. 
                  Posting content that infringes third-party intellectual property rights, or that is obscene, defamatory, or discriminatory. Harassing, threatening, or intimidating any other user or agent.
                </p>
              </div>
            </section>
            <section id="intellectual-property">
              <h2>11. Intellectual Property</h2>
              <p>
                All platform content and technology — including source code, design systems, logos, trademarks, product names, and compiled feed content — is the exclusive property of VenloRent Incorporated or its licensors, protected under international intellectual property law.
                <br/><br/>
                Your Content: You retain ownership of all content you upload to VenloRent (property photos, listing descriptions, request posts, reviews). By uploading, you grant VenloRent a non-exclusive, worldwide, royalty-free licence to store, display, process, and where applicable publish that content for the purpose of operating the platform and providing the service to you.
                <br/><br/>
                Feedback: Any suggestions, ideas, or feature requests you submit may be used by VenloRent at its discretion, without obligation or compensation.
              </p>
            </section>
            <section id="disclaimers">
              <h2>12. Disclaimers & Limitation of Liability</h2>
              <div className="callout warn">
                <p>
                  The VenloRent platform is provided "as is" and "as available." VenloRent makes no warranties, express or implied, including warranties of merchantability, fitness for a particular purpose, title, or non-infringement. We do not warrant that the platform will be uninterrupted, error-free, or free of malicious components.
                </p>
              </div>
              <p>
                To the maximum extent permitted by applicable law, VenloRent's total cumulative liability for any claim arising from these Terms or your use of the platform shall not exceed the greater of: (a) the total service fees paid by you to VenloRent in the 12 months preceding the claim, or (b) USD $100. VenloRent is not liable for any indirect, incidental, consequential, special, or punitive damages, including loss of profits, loss of data, loss of goodwill, or property transaction losses.
                <br/><br/>
                Users in jurisdictions with mandatory consumer protection legislation retain any statutory rights that cannot be excluded by contract.
              </p>
            </section>
            <section id="termination">
              <h2>13. Termination & Suspension</h2>
              
              <p>
                You may deactivate your account at any time by contacting support@venlorent.com. VenloRent may suspend or permanently terminate any account, with or without prior notice, where it determines, in its sole discretion, that these Terms have been violated, KYC documents were fraudulent, there is suspected illegal activity, or continued access poses risk to other users or the platform.
                  <br/><br/>
                Upon termination, your access rights cease immediately. Your active listings will be unpublished and active orders cancelled, with affected counterparties notified. Your data will be handled in accordance with our Privacy Policy retention schedule.
              </p>
            </section>
            <section id="law">
              <h2>14. Governing Law & Dispute Resolution</h2>
              <p>
                These Terms are governed by and construed in accordance with the laws of the jurisdiction in which VenloRent Incorporated is registered, without regard to conflict-of-laws principles. Users accessing VenloRent from other countries are responsible for compliance with applicable local laws.
                <br/><br/>
                Informal Resolution First: Before initiating any formal dispute proceeding, you agree to contact VenloRent at {legalEmail} and attempt to resolve the matter informally for at least 30 days.
                <br/><br/>
                Arbitration: If the dispute is not resolved informally, it shall be submitted to binding arbitration under internationally recognised arbitration rules. Each party waives the right to pursue class action or representative proceedings to the fullest extent permitted by law. Nothing herein prevents either party from seeking urgent injunctive relief from a court of competent jurisdiction.
              </p>
            </section>
            <section id="changes">
              <h2>15. Changes to These Terms</h2>
              <p>
                VenloRent may modify these Terms at any time. When material changes are made, we will notify registered users via email and in-app notification at least 14 days before changes take effect. Your continued use of the platform after the effective date constitutes your acceptance of the revised Terms. The current version of these Terms is always available at <strong>venlorent.com/terms</strong>.
                  <br/><br/>
                Questions about these Terms may be directed to <strong>{legalEmail}</strong>.
              </p>
            </section>
          </article>
        </section>

        <section className="legal-cta card">
          <h2>Need policy clarifications?</h2>
          <p>Our team can provide additional compliance and legal process guidance.</p>
          <div className="legal-cta-actions">
            <Link to="/help" className="btn btn-primary">
              <FiCheckCircle />
              Visit Help Center
            </Link>
            <Link to="/privacy-policy" className="btn btn-secondary">
              View Privacy Policy
            </Link>
          </div>
        </section>
      </main>

      <PrelimFooter />
    </div>
  )
}

export default Terms





