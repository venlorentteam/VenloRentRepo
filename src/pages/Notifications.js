import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { PageSetup, Header, IconNav } from '../exports'
import { RiMessageLine } from 'react-icons/ri'
import { FiTrash2, FiCheck, FiCheckCircle } from 'react-icons/fi'
import { RiVerifiedBadgeFill } from 'react-icons/ri'
import { BsHeartFill, BsChat, BsBookmark } from 'react-icons/bs'
import { timeAgo } from '../components/Time'
import defaultAvatar from '../assets/img/avatar.png'
import { API_BASE } from '../config/api' 
import './Notifications.css'
import '../assets/css/global.css'

// ─────────────────────────────────────────────────────────────
// Human-readable copy for each notification type.
// Kept outside the component so it's never recreated on render.
// ─────────────────────────────────────────────────────────────
const TYPE_META = {
  like_property: { label: "liked your property listing", icon: <BsHeartFill className="notification-icon-like" /> },
  like_request: { label: "liked your request", icon: <BsHeartFill className="notification-icon-like" /> },
  comment: { label: "commented on your listing", icon: <BsChat className="notification-icon-comment" /> },
  discussion: { label: "commented on your request", icon: <BsChat className="notification-icon-comment" /> },
  bookmark: { label: "bookmarked your property", icon: <BsBookmark className="notification-icon-bookmark" /> },
  response: { label: "responded to your request", icon: <RiMessageLine className="notification-icon-message" /> },
  order_placed: { label: "placed an order on your listing", icon: <FiCheckCircle className="notification-icon-system" /> },
  order_accepted: { label: "accepted your order", icon: <FiCheckCircle className="notification-icon-system" /> },
  order_cancelled: { label: "cancelled an order", icon: <FiCheckCircle className="notification-icon-system" /> },
  kyc_update: { label: "Account update", icon: <RiVerifiedBadgeFill className="notification-icon-system" /> },
  follow: { label: "started following you", icon: <RiVerifiedBadgeFill className="notification-icon-system" /> },
  system: { label: "System notification", icon: <FiCheckCircle className="notification-icon-system" /> },
}

function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('all') // 'all' | 'unread'

  // Fetch on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("token")
      if (!token) { setIsLoading(false); return }
      try {
        const res = await axios.get(`${API_BASE}/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setNotifications(res.data.items || [])
      } catch (err) {
        console.error("Failed to fetch notifications:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchNotifications()
  }, [])

  // ── Mark one as read ─────────────────────────────────────────
  const markAsRead = useCallback(async (id) => {
    // Optimistic update first
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    )
    try {
      const token = localStorage.getItem("token")
      await axios.patch(
        `${API_BASE}/notifications/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
    } catch (err) {
      // Rollback on failure
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: false } : n))
      )
      console.error("Failed to mark as read:", err)
    }
  }, [])

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    try {
      const token = localStorage.getItem("token")
      await axios.patch(
        `${API_BASE}/notifications/read-all`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
    } catch (err) {
      console.error("Failed to mark all as read:", err)
    }
  }, [])

  // Delete one
  const deleteNotification = useCallback(async (id) => {
    // Optimistic removal
    setNotifications((prev) => prev.filter((n) => n._id !== id))
    try {
      const token = localStorage.getItem("token")
      await axios.delete(
        `${API_BASE}/notifications/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
    } catch (err) {
      console.error("Failed to delete notification:", err)
      // Could re-add the item here but a silent fail is acceptable for deletes
    }
  }, [])

  // Derived values
  const unreadCount = notifications.filter((n) => !n.read).length
  const filtered    = filter === 'unread'
    ? notifications.filter((n) => !n.read)
    : notifications

  return (
    <PageSetup>
      <Header
        pageTitle={<h2>Notifications</h2>}
        icons={[{ link: "/inbox", element: <RiMessageLine /> }]}
      />

      <div className="main-content">
        <div className="content">

          {/* Filter tabs + mark-all */}
          <div className="notifications-header">
            <div className="notifications-filters">
              <button
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All
                {notifications.length > 0 && (
                  <span className="filter-count">({notifications.length})</span>
                )}
              </button>
              <button
                className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
                onClick={() => setFilter('unread')}
              >
                Unread
                {unreadCount > 0 && (
                  <span className="filter-count">({unreadCount})</span>
                )}
              </button>
            </div>

            {unreadCount > 0 && (
              <button className="mark-all-read-btn" onClick={markAllAsRead}>
                <FiCheck size={16} />
                Mark all as read
              </button>
            )}
          </div>

          {/* Notification list */}
          {isLoading ? (
            <div className="notifications-loading">
              {[0, 1, 2].map((i) => (
                <div key={i} className="skeleton-notification" />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="notifications-list">
              {filtered.map((notification) => {
                const meta   = TYPE_META[notification.type] || TYPE_META.system
                const sender = notification.sender   // populated object or null
                const snap   = notification.snapshot || {}

                return (
                  <div
                    key={notification._id}
                    className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  >
                    {/* Body — clicking marks as read */}
                    <div
                      className="notification-body"
                      onClick={() => !notification.read && markAsRead(notification._id)}
                    >
                      {/* Avatar + type icon badge */}
                      <div className="notification-avatar-container">
                        {sender ? (
                          <img
                            src={sender.avatar || defaultAvatar}
                            alt={sender.fullName || sender.username}
                            className="notification-avatar"
                          />
                        ) : (
                          // System notification — no real sender
                          <div className="notification-avatar system-avatar">
                            <FiCheckCircle />
                          </div>
                        )}
                        <div className="notification-type-icon">
                          {meta.icon}
                        </div>
                      </div>

                      {/* Text content */}
                      <div className="notification-content">
                        <div className="notification-header">
                          <div className="notification-user-info">
                            <h4 className="notification-username">
                              {sender?.fullName || sender?.username || "Venlorent"}
                            </h4>
                            {sender?.kycStatus === "verified" && (
                              <RiVerifiedBadgeFill className="notification-verified" />
                            )}
                          </div>
                          <span className="notification-time">
                            {timeAgo(notification.createdAt)}
                          </span>
                        </div>

                        {/* Action label from TYPE_META */}
                        <p className="notification-action">{meta.label}</p>

                        {/* Snapshot title (property title / request description / KYC message) */}
                        {snap.title && (
                          <p className="notification-message">{snap.title}</p>
                        )}

                        {/* Property preview card — only when image + location exist */}
                        {(snap.image || snap.location) && (
                          <div className="notification-property-preview">
                            {snap.image && (
                              <img
                                src={snap.image}
                                alt={snap.title}
                                className="preview-image"
                              />
                            )}
                            <div className="preview-info">
                              {snap.location && (
                                <p className="preview-title">{snap.location}</p>
                              )}
                              {snap.price && (
                                <p className="preview-price">{snap.price}</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Per-item actions */}
                    <div className="notification-actions">
                      {!notification.read && (
                        <button
                          className="notification-action-btn read-btn"
                          onClick={() => markAsRead(notification._id)}
                          title="Mark as read"
                        >
                          <FiCheck />
                        </button>
                      )}
                      <button
                        className="notification-action-btn delete-btn"
                        onClick={() => deleteNotification(notification._id)}
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </div>

                    {/* Unread dot */}
                    {!notification.read && <div className="unread-indicator" />}
                  </div>
                )
              })}
            </div>
          ) : (
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
                  : "When you get activity on your listings or requests, you'll see it here"}
              </p>
            </div>
          )}
        </div>

        <div className="sidebar" />
      </div>
      <IconNav />
    </PageSetup>
  )
}

export default Notifications