import React, { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { BsGearWide } from "react-icons/bs"
import { RiMessageLine, RiUserFollowLine, RiUserUnfollowLine } from "react-icons/ri"
import { FaRegBell } from "react-icons/fa"
import * as Components from "../exports"
import { useAuth } from "../context/AuthProvider"
import { timeAgo } from "../components/Time"
import defaultAvatar from "../assets/img/avatar.png"
import axios from "axios"
import "./Profile.css"

const Profile = () => {
  const { user } = useAuth()
  const navigate = useNavigate();
  const { userId } = useParams(); // Get userId from URL if viewing another user
  const [isOwnProfile, setIsOwnProfile] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("listings")
  const [profileData, setProfileData] = useState(null)
  const [followersCount, setFollowersCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)

  // Fetch profile data
  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true)
      try {
        const viewingOwn = !userId || userId === "me"
        setIsOwnProfile(viewingOwn)

        if (viewingOwn) {
          const token = localStorage.getItem("token")
          if (token) {
            const res = await axios.get("https://newprojectbackend-5axx.onrender.com/profile", {
              headers: { Authorization: `Bearer ${token}` },
            })
            setProfileData(res.data.user)
            setFollowersCount(res.data.followersCount || 0)
            setFollowingCount(res.data.followingCount || 0)
          } else {
            setProfileData(user)
            setFollowersCount(0)
            setFollowingCount(0)
          }
        } else {
          const token = localStorage.getItem("token")
          const headers = token ? { Authorization: `Bearer ${token}` } : {}
          const res = await axios.get(`https://newprojectbackend-5axx.onrender.com/users/${userId}`, { headers })
          setProfileData(res.data.user || null)
          setFollowersCount(res.data.followersCount || 0)
          setFollowingCount(res.data.followingCount || 0)
          setIsFollowing(!!res.data.isFollowing)
        }
      } catch (err) {
        setProfileData(null)
      } finally {
        setIsLoading(false)
      }
    }
    loadProfile()
  }, [userId, user])

  const handleFollow = () => {
    if (!userId) return
    const token = localStorage.getItem("token")
    if (!token) return
    const next = !isFollowing
    setIsFollowing(next)
    axios
      .post(
        `https://newprojectbackend-5axx.onrender.com/users/${userId}/follow`,
        { followed: next },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setIsFollowing(!!res.data.isFollowing)
        setFollowersCount(res.data.followersCount || 0)
        setFollowingCount(res.data.followingCount || 0)
      })
      .catch(() => {
        setIsFollowing(!next)
      })
  }

  
  const handleMessage = () => {
    navigate("/inbox");
    // TODO: Open chat with this user (not going to be implemented anymore)
    // Walter: That's right, Pending till futher notice
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
    )
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
    )
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
            //occupation={profileData.occupation}
            followers={followersCount}
            email={profileData.email}
            plan={profileData.plan}
            avatar={profileData.avatar || defaultAvatar}
            verified={profileData.kycStatus === "verified"}
            bio={profileData.bio}
            yearJoined={timeAgo(profileData.createdAt)}
            isOwner={isOwnProfile}
            isFollowing={isFollowing}
            onEditProfile={handleEditProfile}
            onUpgrade={handleUpgrade}
            onFollow={handleFollow}
            onMessage={handleMessage}
          />

          {/* Stats */}
          <Components.ListStats stats={profileData?.stats || []} />

          {/* Tabs Navigation */}
          <div className="profile-tabs">
            <button
              className={`profile-tab ${activeTab === "listings" ? "active" : ""}`}
              onClick={() => setActiveTab("listings")}
            >
              Listings ({profileData?.listings?.length || 0})
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
                {profileData?.listings?.length > 0 ? (
                  <div className="listings-grid">
                    {profileData?.listings?.map((listing) => (
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
                  <p>Joined {timeAgo(profileData.createdAt)}</p>
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
              {/* <Components.ClickButton
                text="Message"
                icon={<RiMessageLine />}
                variant="outline"
                onClick={handleMessage}
                size="large"
              /> */}
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
