import React from "react";
import "./AccountInfoCard.css";
import { ClickButton } from "../exports";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { MdEmail, MdWorkspacePremium } from "react-icons/md";

const AccountInfoCard = ({
  username = "@walcode",
  fullName = "Obinabo Walter",
  occupation = "Programmer, App Developer",
  followers = "10k",
  email = "walter@gmail.com",
  plan = "Pro",
  avatar = "https://i.pravatar.cc/100",
  isOwner = false,
  verified = false,
  yearJoined = "2025",
  onEditProfile,
  onUpgrade,
  onFollow,
  onMessage,
}) => {
  return (
    <div className="account-info-container">
      {/* Main Info Card */}
      <div className="account-info-card">
        {/* Header Section */}
        <div className="account-card-header">
          <div className="account-card-left">
            <img src={avatar} alt={fullName} className="account-card-avatar" />
            
            <div className="account-card-user">
              <div className="account-card-name-row">
                <h2 className="account-card-name">{fullName}</h2>
                {verified && (
                  <RiVerifiedBadgeFill 
                    className="account-verified-badge" 
                    aria-label="Verified" 
                  />
                )}
              </div>
              <p className="account-card-username">{username}</p>
              {occupation && (
                <p className="account-card-occupation">{occupation}</p>
              )}
            </div>
          </div>

          <div className="account-card-right">
            <div className="account-followers-section">
              <h3 className="account-followers-count">{followers}</h3>
              <span className="account-followers-label">Followers</span>
            </div>
            <div className="account-member-since">
              <span className="account-member-label">
                Member since <strong className="account-year">{yearJoined}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="account-card-details">
          <div className="account-detail-item">
            <div className="account-detail-label">
              <MdEmail className="account-detail-icon" />
              <span>Email</span>
            </div>
            <span className="account-detail-value">{email}</span>
          </div>

          <div className="account-detail-item">
            <div className="account-detail-label">
              <MdWorkspacePremium className="account-detail-icon" />
              <span>Plan</span>
            </div>
            <span className={`account-plan-badge ${plan.toLowerCase()}`}>
              {plan}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="account-card-actions">
        {isOwner ? (
          <>
            <ClickButton
              text="Edit Profile"
              variant="primary"
              onClick={onEditProfile}
            />
            <ClickButton
              text="Upgrade Plan"
              variant="outline"
              onClick={onUpgrade}
            />
          </>
        ) : (
          <>
            <ClickButton
              text="Follow"
              variant="primary"
              onClick={onFollow}
            />
            <ClickButton
              text="Message"
              variant="outline"
              onClick={onMessage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AccountInfoCard;