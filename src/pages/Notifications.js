import React, { useState, useEffect } from 'react'
import { PageSetup, Header, IconNav } from '../exports'
import { RiMessageLine } from 'react-icons/ri'
import { FiTrash2, FiCheck, FiCheckCircle } from 'react-icons/fi'
import { RiVerifiedBadgeFill } from 'react-icons/ri'
import { BsHeart, BsHeartFill, BsChat, BsBookmark } from 'react-icons/bs'
import { GrLocation } from 'react-icons/gr'
import './Notifications.css'
import '../assets/css/global.css'

/**
 * NOTIFICATIONS PAGE VISION:
 * =========================
 * 
 * Features:
 * 1. Multiple notification types (likes, comments, bookmarks, new properties, agent updates, system)
 * 2. Filterable tabs (All, Unread, etc.)
 * 3. Each notification shows:
 *    - User avatar & verification badge
 *    - Action type icon & description
 *    - Timestamp
 *    - Related property/content preview (if applicable)
 *    - Read/Unread state
 * 4. Actions: Mark as read, delete, view details
 * 
 */

function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, unread
  const [selectedNotification, setSelectedNotification] = useState(null)

  // Initialize notifications on mount
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setNotifications([
        {
          id: 1,
          type: 'like', // like, comment, bookmark, new_property, agent_update, system
          avatar: "https://i.pravatar.cc/100?img=5",
          username: "Jay Carlos",
          handle: "@jaycarlx",
          verified: true,
          action: "liked your property listing",
          message: "Luxury 4-bedroom duplex with swimming pool, gym, and 24/7 power supply.",
          timestamp: "2m ago",
          read: false,
          property: {
            image: "https://i.pravatar.cc/150?img=1",
            title: "Lekki Phase 1, Lagos",
            price: "₦1,200,000"
          }
        },
        {
          id: 2,
          type: 'comment',
          avatar: "https://i.pravatar.cc/100?img=8",
          username: "Grace Homes",
          handle: "@gracehomes",
          verified: false,
          action: "commented on your listing",
          message: "Is this property still available? Very interested in viewing it.",
          timestamp: "15m ago",
          read: false,
          property: {
            image: "https://i.pravatar.cc/150?img=2",
            title: "Kubwa, Abuja",
            price: "₦450,000"
          }
        },
        {
          id: 3,
          type: 'bookmark',
          avatar: "https://i.pravatar.cc/100?img=12",
          username: "Wally White",
          handle: "@wallywhite",
          verified: true,
          action: "bookmarked your property",
          message: "Self contained apartment, with steady water and light.",
          timestamp: "45m ago",
          read: true,
          property: {
            image: "https://i.pravatar.cc/150?img=3",
            title: "Gwagwalada, Abuja",
            price: "₦700,000"
          }
        },
        {
          id: 4,
          type: 'new_property',
          avatar: "https://i.pravatar.cc/100?img=1",
          username: "Premium Properties",
          handle: "@premiumprops",
          verified: true,
          action: "posted a new property",
          message: "Exclusive penthouse with panoramic city views",
          timestamp: "1h ago",
          read: false,
          property: {
            image: "https://i.pravatar.cc/150?img=4",
            title: "Victoria Island, Lagos",
            price: "₦2,500,000"
          }
        },
        {
          id: 5,
          type: 'agent_update',
          avatar: "https://i.pravatar.cc/100?img=15",
          username: "Obinabo Walter",
          handle: "@walcode",
          verified: true,
          action: "responded to your inquiry",
          message: "Thanks for your interest! Let me send you more details about the property.",
          timestamp: "2h ago",
          read: true,
          property: {
            image: "https://i.pravatar.cc/150?img=5",
            title: "Ikoyi, Lagos",
            price: "₦850,000"
          }
        },
        {
          id: 6,
          type: 'system',
          avatar: null,
          username: "Venlorent",
          handle: "system",
          verified: false,
          action: "System notification",
          message: "Your property listing verification is complete! You are now a verified agent.",
          timestamp: "3h ago",
          read: true,
          property: null
        },
        {
          id: 7,
          type: 'like',
          avatar: "https://i.pravatar.cc/100?img=20",
          username: "David King",
          handle: "@davidking",
          verified: false,
          action: "liked your property listing",
          message: "Modern townhouse in a gated community.",
          timestamp: "5h ago",
          read: true,
          property: {
            image: "https://i.pravatar.cc/150?img=6",
            title: "Wuse 2, Abuja",
            price: "₦550,000"
          }
        },
        {
          id: 8,
          type: 'comment',
          avatar: "https://i.pravatar.cc/100?img=10",
          username: "Zara Femi",
          handle: "@zarafemi",
          verified: true,
          action: "replied to your comment",
          message: "Agree! The location is perfect for that price range.",
          timestamp: "6h ago",
          read: true,
          property: {
            image: "https://i.pravatar.cc/150?img=7",
            title: "Lekki, Lagos",
            price: "₦900,000"
          }
        },
      ])
      setIsLoading(false)
    }, 800)
  }, [])

  // Filter notifications
  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  // Delete notification
  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch(type) {
      case 'like':
        return <BsHeartFill className="notification-icon-like" />
      case 'comment':
        return <BsChat className="notification-icon-comment" />
      case 'bookmark':
        return <BsBookmark className="notification-icon-bookmark" />
      case 'new_property':
        return <BsBookmark className="notification-icon-property" />
      case 'agent_update':
        return <RiMessageLine className="notification-icon-message" />
      case 'system':
        return <FiCheckCircle className="notification-icon-system" />
      default:
        return <FiCheck className="notification-icon-default" />
    }
  }

  return (
    <PageSetup>
      <Header
        pageTitle={<h2>Notifications</h2>}
        icons={[
          {link: "/inbox", element: <RiMessageLine />}
        ]}
      />
      
      <div className="main-content">
        <div className="content">
          {/* Notifications Header */}
          <div className="notifications-header">
            <div className="notifications-filters">
              <button 
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All {notifications.length > 0 && <span className="filter-count">({notifications.length})</span>}
              </button>
              <button 
                className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
                onClick={() => setFilter('unread')}
              >
                Unread {notifications.filter(n => !n.read).length > 0 && <span className="filter-count">({notifications.filter(n => !n.read).length})</span>}
              </button>
            </div>
            
            {notifications.filter(n => !n.read).length > 0 && (
              <button className="mark-all-read-btn" onClick={markAllAsRead}>
                <FiCheck size={16} />
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          {isLoading ? (
            <div className="notifications-loading">
              <div className="skeleton-notification"></div>
              <div className="skeleton-notification"></div>
              <div className="skeleton-notification"></div>
            </div>
          ) : filteredNotifications.length > 0 ? (
            <div className="notifications-list">
              {filteredNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                >
                  {/* Notification Body */}
                  <div 
                    className="notification-body"
                    onClick={() => !notification.read && markAsRead(notification.id)}
                  >
                    {/* Avatar & Icon */}
                    <div className="notification-avatar-container">
                      {notification.avatar ? (
                        <img 
                          src={notification.avatar} 
                          alt={notification.username}
                          className="notification-avatar"
                        />
                      ) : (
                        <div className="notification-avatar system-avatar">
                          <FiCheckCircle />
                        </div>
                      )}
                      <div className="notification-type-icon">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="notification-content">
                      {/* Header: Username & Verification */}
                      <div className="notification-header">
                        <div className="notification-user-info">
                          <h4 className="notification-username">{notification.username}</h4>
                          {notification.verified && (
                            <RiVerifiedBadgeFill className="notification-verified" />
                          )}
                        </div>
                        <span className="notification-time">{notification.timestamp}</span>
                      </div>

                      {/* Action Text */}
                      <p className="notification-action">{notification.action}</p>

                      {/* Message */}
                      <p className="notification-message">{notification.message}</p>

                      {/* Property Preview */}
                      {notification.property && (
                        <div className="notification-property-preview">
                          <img 
                            src={notification.property.image}
                            alt={notification.property.title}
                            className="preview-image"
                          />
                          <div className="preview-info">
                            <p className="preview-title">{notification.property.title}</p>
                            <p className="preview-price">{notification.property.price}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="notification-actions">
                    {!notification.read && (
                      <button 
                        className="action-btn read-btn"
                        onClick={() => markAsRead(notification.id)}
                        title="Mark as read"
                      >
                        <FiCheck />
                      </button>
                    )}
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => deleteNotification(notification.id)}
                      title="Delete notification"
                    >
                      <FiTrash2 />
                    </button>
                  </div>

                  {/* Unread Indicator */}
                  {!notification.read && <div className="unread-indicator"></div>}
                </div>
              ))}
            </div>
          ) : (
            // Empty State
            <div className="notifications-empty">
              <div className="empty-icon">
                {filter === 'unread' ? <FiCheckCircle size={64} /> : <BsChat size={64} />}
              </div>
              <h3>
                {filter === 'unread' ? "You're all caught up!" : "No notifications yet"}
              </h3>
              <p>
                {filter === 'unread' 
                  ? "Check back later for updates"
                  : "When you get activity on your listings, you'll see it here"}
              </p>
            </div>
          )}
        </div>

        <div className="sidebar">
          {/*Optional for follows and all*/}
        </div>
      </div>
      <IconNav />
    </PageSetup>
  )
}

export default Notifications