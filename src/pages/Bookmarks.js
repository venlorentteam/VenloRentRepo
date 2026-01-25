import React, { useState, useEffect } from 'react'
import { SideNav, Header, IconNav, PageSetup } from '../exports'
import { RiMessageLine } from 'react-icons/ri'
import { FaRegBell } from 'react-icons/fa'
import { FaBookmark } from 'react-icons/fa'
import { GrLocation } from 'react-icons/gr'
import { RiVerifiedBadgeFill } from 'react-icons/ri'
import './Bookmarks.css'
import propertyImg1 from '../assets/img/house-isolated-field.jpg'
import propertyImg2 from '../assets/img/3d-rendering-house-model.jpg'

function Bookmarks() {
  const [bookmarkedListings, setBookmarkedListings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedListing, setSelectedListing] = useState(null)

  // Fetch bookmarked listings on mount
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBookmarkedListings([
        {
          id: 1,
          avatar: "https://i.pravatar.cc/100?img=1",
          username: "Obinabo Walter",
          handle: "@walcode",
          verified: true,
          time: "2h ago",
          image: propertyImg2,
          price: "₦700,000",
          location: "Gwagwalada, Abuja",
          category: "Apartment",
          views: "10k",
          comments: "532",
          savedDate: "5 days ago",
          description: "Self contained apartment, with steady water and light.",
        },
        {
          id: 2,
          avatar: "https://i.pravatar.cc/100?img=5",
          username: "Jay Carlos",
          handle: "@jaycarlx",
          verified: true,
          time: "5h ago",
          image: propertyImg1,
          price: "₦1,200,000",
          location: "Lekki Phase 1, Lagos",
          category: "Duplex",
          views: "25k",
          comments: "1.2k",
          savedDate: "1 week ago",
          description: "Luxury 4-bedroom duplex with swimming pool.",
        },
        {
          id: 3,
          avatar: "https://i.pravatar.cc/100?img=8",
          username: "Grace Homes",
          handle: "@gracehomes",
          verified: false,
          time: "1d ago",
          image: propertyImg2,
          price: "₦450,000",
          location: "Kubwa, Abuja",
          category: "Studio",
          views: "5k",
          comments: "120",
          savedDate: "2 weeks ago",
          description: "Affordable studio apartment perfect for young professionals.",
        },
        {
          id: 4,
          avatar: "https://i.pravatar.cc/100?img=12",
          username: "Premium Properties",
          handle: "@premiumprops",
          verified: true,
          time: "3h ago",
          image: propertyImg1,
          price: "₦2,500,000",
          location: "Victoria Island, Lagos",
          category: "Penthouse",
          views: "45k",
          comments: "2.3k",
          savedDate: "3 days ago",
          description: "Exclusive penthouse with panoramic city views.",
        },
        {
          id: 5,
          avatar: "https://i.pravatar.cc/100?img=15",
          username: "Estate Solutions",
          handle: "@estatesolutions",
          verified: true,
          time: "6h ago",
          image: propertyImg2,
          price: "₦850,000",
          location: "Ikoyi, Lagos",
          category: "Townhouse",
          views: "18k",
          comments: "890",
          savedDate: "1 week ago",
          description: "Modern townhouse in a gated community.",
        },
        {
          id: 6,
          avatar: "https://i.pravatar.cc/100?img=20",
          username: "Abuja Homes",
          handle: "@abujahomes",
          verified: false,
          time: "12h ago",
          image: propertyImg1,
          price: "₦550,000",
          location: "Wuse 2, Abuja",
          category: "Apartment",
          views: "8k",
          comments: "340",
          savedDate: "4 days ago",
          description: "2-bedroom apartment in a secure estate.",
        },
      ])
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleRemoveBookmark = (id) => {
    setBookmarkedListings(bookmarkedListings.filter(listing => listing.id !== id))
  }

  const openListing = (listing) => {
    setSelectedListing(listing)
  }

  const closeListing = () => {
    setSelectedListing(null)
  }

  return (
    <PageSetup>
      <SideNav />{/*Desktop left-side navigation*/}
      <Header //Top page header
        pageTitle={<h2>Bookmarks</h2>}
        icons={
          [
            {link: "/inbox", element: <RiMessageLine />},
            {link: "/notifications", element: <FaRegBell />}
          ]
        }
      />
      <div className="content">
        {/* Bookmarks Grid */}
        {isLoading ? (
          <div className="bookmarks-loading">
            <div className="skeleton-grid"></div>
            <div className="skeleton-grid"></div>
            <div className="skeleton-grid"></div>
          </div>
        ) : bookmarkedListings.length > 0 ? (
          <>
            <div className="bookmarks-header">
              <p className="bookmarks-count">{bookmarkedListings.length} saved items</p>
            </div>
            <div className="bookmarks-grid">
              {bookmarkedListings.map((listing) => (
                <div key={listing.id} className="bookmark-item">
                  <div className="bookmark-image-container" onClick={() => openListing(listing)}>
                    <img 
                      src={listing.image} 
                      alt={listing.category}
                      className="bookmark-image"
                    />
                    <div className="bookmark-overlay">
                      <div className="bookmark-overlay-content">
                        <FaBookmark className="bookmark-overlay-icon" />
                        <span className="bookmark-overlay-text">View Details</span>
                      </div>
                    </div>
                    <div className="bookmark-price">{listing.price}</div>
                    <div className="bookmark-category">{listing.category}</div>
                  </div>
                  
                  <div className="bookmark-info">
                    <div className="bookmark-header">
                      <div className="bookmark-user">
                        <img src={listing.avatar} alt={listing.username} className="bookmark-avatar" />
                        <div className="bookmark-user-info">
                          <div className="bookmark-username-row">
                            <h4 className="bookmark-username">{listing.username}</h4>
                            {listing.verified && <RiVerifiedBadgeFill className="bookmark-verified" />}
                          </div>
                          <p className="bookmark-handle">{listing.handle}</p>
                        </div>
                      </div>
                      <button 
                        className="bookmark-remove-btn"
                        onClick={() => handleRemoveBookmark(listing.id)}
                        title="Remove bookmark"
                      >
                        <FaBookmark />
                      </button>
                    </div>

                    <div className="bookmark-location">
                      <GrLocation size={14} />
                      <span>{listing.location}</span>
                    </div>

                    <p className="bookmark-description">{listing.description}</p>

                    <div className="bookmark-meta">
                      <span className="bookmark-saved">Saved {listing.savedDate}</span>
                      <span className="bookmark-stats">{listing.views} views</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          // Empty State
          <div className="bookmarks-empty">
            <div className="empty-icon">
              <FaBookmark size={64} />
            </div>
            <h3>No bookmarks yet</h3>
            <p>Save properties to view them later. Explore properties on the home feed!</p>
          </div>
        )}
      </div>

      {/* Listing Detail Modal */}
      {selectedListing && (
        <div className="listing-detail-modal" onClick={closeListing}>
          <div className="listing-detail-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeListing}>×</button>
            
            <div className="modal-body">
              <img src={selectedListing.image} alt={selectedListing.category} className="modal-image" />
              
              <div className="modal-info">
                <div className="modal-header">
                  <div className="modal-user">
                    <img src={selectedListing.avatar} alt={selectedListing.username} />
                    <div>
                      <div className="modal-username-row">
                        <h3>{selectedListing.username}</h3>
                        {selectedListing.verified && <RiVerifiedBadgeFill />}
                      </div>
                      <p>{selectedListing.handle}</p>
                    </div>
                  </div>
                </div>

                <div className="modal-price-section">
                  <span className="modal-price">{selectedListing.price}</span>
                  <span className="modal-category">{selectedListing.category}</span>
                </div>

                <div className="modal-location">
                  <GrLocation size={16} />
                  <span>{selectedListing.location}</span>
                </div>

                <p className="modal-description">{selectedListing.description}</p>

                <div className="modal-stats">
                  <div className="stat">
                    <span className="stat-label">Views</span>
                    <span className="stat-value">{selectedListing.views}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Comments</span>
                    <span className="stat-value">{selectedListing.comments}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Saved</span>
                    <span className="stat-value">{selectedListing.savedDate}</span>
                  </div>
                </div>

                <button className="modal-action-btn">Contact Agent</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="sidebar">
        {/*Optional for follows and all*/}
      </div>
      <IconNav />{/*Mobile bottom navigation*/}
    </PageSetup>
  )
}

export default Bookmarks
