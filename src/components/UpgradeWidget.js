import React from 'react'
import "./UpgradeWidget.css";
import { ClickButton } from '../exports';
import { MdWorkspacePremium } from "react-icons/md";
import { IoSparkles } from "react-icons/io5";

const UpgradeWidget = ({
  title = "Upgrade to Premium",
  text = "Unlock exclusive features and enhance your experience by upgrading to a Premium account today!",
  features = [
    "Unlimited boosted listings",
    "Priority support",
    "Advanced analytics",
    "Verified badge"
  ],
  onClick
}) => {
  return (
    <div className="upgrade-widget">
      {/* Premium Icon */}
      <div className="upgrade-icon-wrapper">
        <MdWorkspacePremium className="upgrade-icon" />
        <IoSparkles className="upgrade-sparkle" />
      </div>

      {/* Content */}
      <h3 className="upgrade-title">{title}</h3>
      <p className="upgrade-text">{text}</p>

      {/* Features List */}
      {features && features.length > 0 && (
        <ul className="upgrade-features">
          {features.map((feature, index) => (
            <li key={index} className="upgrade-feature-item">
              <span className="upgrade-feature-check">✓</span>
              {feature}
            </li>
          ))}
        </ul>
      )}

      {/* CTA Button */}
      <ClickButton 
        onClick={onClick} 
        text="Upgrade Now" 
        variant="primary"
        size="large"
      />
    </div>
  )
}

export default UpgradeWidget