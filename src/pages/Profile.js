import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BsGearWide } from "react-icons/bs";
import { RiMessageLine, RiUserFollowLine, RiUserUnfollowLine } from "react-icons/ri";
import { FaRegBell } from "react-icons/fa";
import * as Components from "../exports";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const { userId } = useParams(); // Get userId from URL if viewing another user
  const queryParams = new URLSearchParams(window.location.search);
  const viewMode = queryParams.get("view"); // Check for ?view=other query param
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("listings");
  const [profileData, setProfileData] = useState(null);

  // Fetch profile data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockProfile = {
        username: "@walcode",
        fullName: "Obinabo Walter",
        occupation: "Software Developer & Real Estate Agent",
        followers: "1.2k",
        email: "walter@venlorent.com",
        plan: "Pro",
        avatar: "https://i.pravatar.cc/100?img=1",
        verified: true,
        yearJoined: "2024",
        stats: [
          { label: "Properties Listed", value: "24" },
          { label: "Orders Completed", value: "156" },
          { label: "Success Rate", value: "98%" },
          { label: "Followers", value: "1.2k" }
        ],
        listings: [
          {
            id: 1,
            image: ["https://via.placeholder.com/600x400"],
            price: "₦700,000",
            location: "Lekki, Lagos",
            category: "Apartment"
          },
          {
            id: 2,
            image: ["https://via.placeholder.com/600x400"],
            price: "₦1,200,000",
            location: "Ikoyi, Lagos",
            category: "Duplex"
          }
        ]
      };

      setProfileData(mockProfile);
      // Check view query param for demo, otherwise check userId
      setIsOwnProfile(viewMode !== "other" && (!userId || userId === "me"));
      setIsLoading(false);
    }, 1000);
  }, [userId]);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // TODO: API call to follow/unfollow
  };

  const handleMessage = () => {
    navigate("/inbox");
    // TODO: Open chat with this user (not going to be implemented anymore)
  };

  const handleEditProfile = () => {
    navigate("/account/profile");
  };

  const handleUpgrade = () => {
    navigate("/account/subscription");
  };

  if (isLoading) {
    return (
      <Components.PageSetup>
        <Components.Header
          backIcon={!isOwnProfile}
          pageTitle={<h2>Profile</h2>}
          icons={[
            { link: "/notifications", element: <FaRegBell /> }
          ]}
        />
        <div className="main-content">
          <div className="content">
            <div className="profile-loading">
              <div className="skeleton skeleton-profile-header"></div>
              <div className="skeleton skeleton-stats"></div>
            </div>
          </div>
        </div>
      </Components.PageSetup>
    );
  }

  if (!profileData) {
    return (
      <Components.PageSetup>
        <Components.Header
          backIcon={true}
          pageTitle={<h2>Profile</h2>}
        />
        <div className="main-content">
          <div className="content">
            <div className="profile-error">
              <h3>Profile not found</h3>
              <p>This user doesn't exist or has been removed.</p>
              <Components.ClickButton
                text="Go Back"
                onClick={() => navigate(-1)}
                variant="primary"
              />
            </div>
          </div>
        </div>
      </Components.PageSetup>
    );
  }

  return (
    <Components.PageSetup>
      <Components.Header
        backIcon={!isOwnProfile}
        pageTitle={<h2>{isOwnProfile ? "My Profile" : profileData.fullName}</h2>}
        icons={
          isOwnProfile ? [
            { link: "/inbox", element: <RiMessageLine /> },
            { link: "/notifications", element: <FaRegBell /> }
          ] : [
            { link: "/notifications", element: <FaRegBell /> }
          ]
        }
        menuIcon={isOwnProfile ? { element: <BsGearWide />, link: "/account" } : null}
      />
      
      <div className="main-content">
        <div className="content">
          {/* Profile Header Card */}
          <Components.AccountInfoCard
            username={profileData.username}
            fullName={profileData.fullName}
            occupation={profileData.occupation}
            followers={profileData.followers}
            email={profileData.email}
            plan={profileData.plan}
            avatar={profileData.avatar}
            verified={profileData.verified}
            yearJoined={profileData.yearJoined}
            isOwner={isOwnProfile}
            onEditProfile={handleEditProfile}
            onUpgrade={handleUpgrade}
            onFollow={handleFollow}
            onMessage={handleMessage}
          />

          {/* Stats */}
          <Components.ListStats stats={profileData.stats} />

          {/* Tabs Navigation */}
          <div className="profile-tabs">
            <button
              className={`profile-tab ${activeTab === "listings" ? "active" : ""}`}
              onClick={() => setActiveTab("listings")}
            >
              Listings ({profileData.listings.length})
            </button>
            <button
              className={`profile-tab ${activeTab === "reviews" ? "active" : ""}`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews
            </button>
            <button
              className={`profile-tab ${activeTab === "about" ? "active" : ""}`}
              onClick={() => setActiveTab("about")}
            >
              About
            </button>
          </div>

          {/* Tab Content */}
          <div className="profile-tab-content">
            {activeTab === "listings" && (
              <div className="profile-listings">
                {profileData.listings.length > 0 ? (
                  <div className="listings-grid">
                    {profileData.listings.map((listing) => (
                      <div key={listing.id} className="listing-grid-item">
                        <img src={listing.image[0]} alt="Property" />
                        <div className="listing-grid-info">
                          <h4 className="listing-price">{listing.price}</h4>
                          <p className="listing-location">{listing.location}</p>
                          <span className="listing-category">{listing.category}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="profile-empty">
                    <p>No listings yet</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="profile-reviews">
                <div className="profile-empty">
                  <p>No reviews yet</p>
                </div>
              </div>
            )}

            {activeTab === "about" && (
              <div className="profile-about">
                <div className="about-section">
                  <h4>About {profileData.fullName}</h4>
                  <p>{profileData.occupation}</p>
                  <p>Joined in {profileData.yearJoined}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          {!isOwnProfile && (
            <div className="profile-sidebar-actions">
              <Components.ClickButton
                text={isFollowing ? "Following" : "Follow"}
                icon={isFollowing ? <RiUserUnfollowLine /> : <RiUserFollowLine />}
                variant={isFollowing ? "outline" : "primary"}
                onClick={handleFollow}
                size="large"
              />
              <Components.ClickButton
                text="Message"
                icon={<RiMessageLine />}
                variant="outline"
                onClick={handleMessage}
                size="large"
              />
            </div>
          )}
          
          {isOwnProfile && (
            <Components.UpgradeWidget
              title="Upgrade Your Plan"
              text="Get more features and visibility with a premium plan!"
              onClick={handleUpgrade}
            />
          )}
        </div>
      </div>
    </Components.PageSetup>
  );
};

export default Profile;