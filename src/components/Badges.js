// components/Badges.jsx
import './Badges.css'
import { RiVerifiedBadgeFill } from 'react-icons/ri'
import { MdOutlineWorkspacePremium } from 'react-icons/md'

export function AgentBadge({className=''}) {
  return (
    <RiVerifiedBadgeFill
      className={`agent-badge ${className}`}
      aria-label="KYC verified agent"
    />
  )
}

export function PremiumBadge() {
  return (
    <MdOutlineWorkspacePremium
      className="premium-badge"
      aria-label="KYC verified agent"
    />
  )
}