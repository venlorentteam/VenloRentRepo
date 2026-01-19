import React from 'react'
import "./UpgradeWidget.css";
import { ClickButton } from '../exports';
const UpgradeWidget = ({
  title = "Upgrade to Premium",
  text = "Unlock exclusive features and enhance your experience by upgrading to a Premium account today!",
  onClick
}) => {
  return (
    <div className="upgrade-cont">
      {/* upgrade widget component, This component shows up on the sidebar when a user account isn't on Premium*/}
      <h2 className="upgrade-title">{title}</h2>
      <p className="upgrade-text">{text}</p>
      <ClickButton onClick={onClick} text="Subscribe" variant="subscribe"/>
    </div>
  )
}

export default UpgradeWidget