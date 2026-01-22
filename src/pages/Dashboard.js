import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header, ClickButton, PageSetup, PropertyCard, UpgradeWidget } from '../exports'
import { RiMessageLine, RiAddCircleLine } from 'react-icons/ri'
import { FaRegBell } from 'react-icons/fa'
import '../assets/css/global.css'
import './Dashboard.css'
import propertyImg1 from '../assets/img/house-isolated-field.jpg'
import propertyImg2 from '../assets/img/3d-rendering-house-model.jpg'

function Dashboard() {
  const navigate = useNavigate()
  const [listings, setListings] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch listings on mount ( walter , you will need to replace dis with actual API call)
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setListings([
        {
          id: 1,
          avatar: "https://i.pravatar.cc/100?img=1",
          username: "Obinabo Walter",
          handle: "@walcode",
          verified: true,
          time: "2h ago",
          image: [propertyImg2, propertyImg1],
          price: "₦700,000",
          location: "Gwagwalada, Abuja",
          category: "Apartment",
          views: "10k",
          comments: "532",
          bookmarked: false,
          description: "Self contained apartment, with steady water and light. Very secure environment with 24/7 security.",
        },
        {
          id: 2,
          avatar: "https://i.pravatar.cc/100?img=5",
          username: "Jay Carlos",
          handle: "@jaycarlx",
          verified: true,
          time: "5h ago",
          image: [propertyImg1],
          price: "₦1,200,000",
          location: "Lekki Phase 1, Lagos",
          category: "Duplex",
          views: "25k",
          comments: "1.2k",
          bookmarked: true,
          description: "Luxury 4-bedroom duplex with swimming pool, gym, and 24/7 power supply.",
        },
        {
          id: 3,
          avatar: "https://i.pravatar.cc/100?img=8",
          username: "Grace Homes",
          handle: "@gracehomes",
          verified: false,
          time: "1d ago",
          image: [propertyImg2],
          price: "₦450,000",
          location: "Kubwa, Abuja",
          category: "Studio",
          views: "5k",
          comments: "120",
          bookmarked: false,
          description: "Affordable studio apartment perfect for young professionals.",
        },
      ])
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleCreatePost = () => {
    navigate('/create/post-a-request')
  }

  const handleOrder = (listingId) => {
    navigate(`/listing/${listingId}/order`)
    // TODO: Implement order flow
  }

  return (
    <PageSetup>
      <Header
        pageTitle={<h2>Home</h2>}
        icons={[
          { link: "/inbox", element: <RiMessageLine /> },
          { link: "/notifications", element: <FaRegBell /> }
        ]}
        button={
          <ClickButton 
            text="Create" 
            icon={<RiAddCircleLine />}
            onClick={handleCreatePost}
            variant="primary"
            size="medium"
          />
        }
      />
      
      <div className="main-content">
        <div className="content">
          {/* Feed Content */}
          {isLoading ? (
            // Loading State
            <div className="feed-loading">
              <div className="skeleton skeleton-card"></div>
              <div className="skeleton skeleton-card"></div>
              <div className="skeleton skeleton-card"></div>
            </div>
          ) : listings.length > 0 ? (
            // Listings Feed
            listings.map((listing) => (
              <PropertyCard
                key={listing.id}
                {...listing}
                onOrder={() => handleOrder(listing.id)}
              />
            ))
          ) : (
            // Empty State
            <div className="feed-empty">
              <div className="empty-icon">🏠</div> // need to replace this with an actual illustration, ask mart
              <h3>No listings yet</h3>
              <p>Be the first to post a property or request!</p>
              <ClickButton 
                text="Create Post" 
                onClick={handleCreatePost}
                variant="primary"
              />
            </div>
          )}
        </div>

        {/* Sidebar - Desktop Only */}
        <div className="sidebar">
          {/* Upgrade Widget */}
          <UpgradeWidget
            title="Become a Verified Agent"
            text="Get verified to list properties and connect with more clients!"
            features={[
              "List unlimited properties",
              "Get verified badge",
              "Priority support",
              "Boost your listings"
            ]}
            onClick={() => navigate('/account/verification')}
          />

          {/* Suggested Agents - Future */}
          {/* <div className="suggested-agents">
            <h3>Suggested Agents</h3>
          </div> */}
        </div>
      </div>
    </PageSetup>
  )
}

export default Dashboard