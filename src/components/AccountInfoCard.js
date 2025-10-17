import React from "react";
import "./AccountInfoCard.css";
import {ClickButton} from "../exports";

const AccountInfoCard = ({
  username = "@walcode",
  fullName = "Obinabo Walter",
  occupation = "Programmer,  App Developer",
  followers = "10k",
  email = "walter@gmail.com",
  plan = "Pro",
  avatar = "https://i.pravatar.cc/100",
  isOwner = false,
  yearJoined = "2025"
}) => {
  return (
    <div className="account-container">
      {/* Main Info Section */}
      <div className="account-info-card">
        <div className="account-header">
          <div className="account-left">
            <img src={avatar} alt={fullName} className="account-avatar" />
            <div className="account-user">
              <h2>{fullName}</h2>
              <p className="username">{username}</p>
              <p className="occupation">{occupation}</p>
            </div>
          </div>

          <div className="account-right">
            <div className="followers">
                <h3 className="followers-count">{followers} <span className="followers-label">Followers</span></h3>
                
            </div>
            <div>
                <span className="followers-label">Member since  <b className="year">{yearJoined}</b> </span>
            </div>
          </div>
        </div>

        <div className="account-details">
          <div className="detail-item">
            <span className="label">Email:</span>
            <span className="value">{email}</span>
          </div>
          <div className="detail-item">
            <span className="label">Plan:</span>
            <span className="value">{plan}</span>
          </div>
        </div>
      </div>

      {/* Buttons Section */}
      <div className="account-actions">
        {isOwner ? (
          <>
            <ClickButton
              text="Edit Profile"
              variant="secondary"
              onClick={() => alert("Edit Profile")}
            />
            <ClickButton
              text="Upgrade Plan"
              variant="outline"
              onClick={() => alert("Upgrade Plan")}
            />
          </>
        ) : (
          <>
            <ClickButton
              text="Follow"
              variant="secondary"
              onClick={() => alert("Followed!")}
            />
            <ClickButton
              text="Message"
              variant="outline"
              onClick={() => alert("Open Messages")}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AccountInfoCard;
