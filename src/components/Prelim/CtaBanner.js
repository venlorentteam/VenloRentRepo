import React from 'react'
import { Link } from 'react-router-dom'
import './CtaBanner.css'
const CtaBanner = ({
    title = "Ready to find your home?",
    subtitle = "Join thousands of Nigerians who've found their perfect property on VenloRent.",
    buttons = [
        { href: "/register", name: "Create free account", style: "white" },
        { href: "/login", name: "I have an account", style: "outline-white" }
    ]
}) => {
  return (
    <section className="cta-section">
        <div className="cta-blob" aria-hidden="true" />
        <div className="cta-inner">
          <h2 className="cta-title">{title}</h2>
          <p className="cta-sub">{subtitle}</p>
          <div className="cta-actions">
            {(buttons) && buttons.map((btn) => {
                return(
                <Link key={btn.name} to={btn.href} className={`btn btn-${btn.style}`}>
                    {btn.name}
                </Link>
            )})}
          </div>
        </div>
    </section>
  )
}

export default CtaBanner