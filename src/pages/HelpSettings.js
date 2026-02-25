// ========================================
// settings/HelpSettings.js
// ========================================
import React, { useState } from 'react'
import { ClickButton } from '../exports'
import { FiChevronDown, FiChevronUp, FiMail } from 'react-icons/fi'

const HelpSettings = () => {
  const [expandedFaq, setExpandedFaq] = useState(null)

  const faqs = [
    {
      question: 'How do I become a verified agent?',
      answer: 'Go to Settings > Agent Verification and submit your KYC documents including government ID and business proof. We will review within 24-48 hours.'
    },
    {
      question: 'How does the order system work?',
      answer: 'When you place an order, the listing is reserved for 3 days. You can inspect the property and make payment through the app. If no payment is made within 3 days, the order is automatically cancelled.'
    },
    {
      question: 'What payment methods are supported?',
      answer: 'We support card payments (Visa, Mastercard, Verve), bank transfers, and USSD through our payment partners Flutterwave and Paystack.'
    },
    {
      question: 'Can I get a refund?',
      answer: 'Refunds are handled on a case-by-case basis. Please contact support with your order details.'
    },
    {
      question: 'How do I report a listing?',
      answer: 'Click the three dots menu on any listing and select "Report". Our team will review your report within 24 hours.'
    }
  ]

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2>Help & Support</h2>
        <p className="settings-subtitle">Get answers to common questions</p>
      </div>

      <div className="settings-section">
        <h3 className="section-title">Frequently Asked Questions</h3>
        
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className={`faq-item ${expandedFaq === index ? 'expanded' : ''}`}>
              <button className="faq-question" onClick={() => toggleFaq(index)}>
                <span>{faq.question}</span>
                {expandedFaq === index ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              {expandedFaq === index && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <h3 className="section-title">Contact Support</h3>
        <div className="contact-support">
          <FiMail className="contact-icon" />
          <div>
            <h4>Email Us</h4>
            <p>support@venlorent.com</p>
            <p className="contact-note">We typically respond within 24 hours</p>
          </div>
        </div>
        <ClickButton
          text="Send us a message"
          onClick={() => window.location.href = 'mailto:support@venlorent.com'}
          variant="primary"
          size="large"
        />
      </div>
    </div>
  )
}

export default HelpSettings
