// ========================================
// ========================================
import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from "../context/AuthProvider";
import { FiUser, FiBell, FiShield, FiHelpCircle } from 'react-icons/fi'
import { MdOutlineWorkspacePremium, MdVerifiedUser, MdBookmarkBorder } from 'react-icons/md'
import { MdOutlineAccountBalance } from 'react-icons/md'
import { HiOutlineExclamationCircle } from "react-icons/hi2"
import { LiaAngleRightSolid } from "react-icons/lia"
import './SettingsMenu.css'
import { IoLogOutOutline } from "react-icons/io5"

// ========================================
// Settings Menu Component for Account Settings Page
// ========================================


const SettingsMenu = () => {
  //Call useAuth to get user info and logout function
  const { logout, user } = useAuth();
  const location = useLocation()
  const settingsMenu = [
    { id: 'account', label: 'Account', icon: FiUser, description: 'Edit profile, change password' },
    { id: 'notifications', label: 'Notifications', icon: FiBell, description: 'Manage notification preferences' },
    { id: 'security', label: 'Security & Privacy', icon: FiShield, description: 'Password, privacy settings' },
    { id: 'bookmarks', label: 'Bookmarks', icon: MdBookmarkBorder, description: 'View saved properties' },
    { id: 'verification', label: 'Agent Verification', icon: MdVerifiedUser, description: 'Become a verified agent' },
    ...(user?.kycStatus === 'verified'
      ? [{ id: 'payment-details', label: 'Payment Details', icon: MdOutlineAccountBalance, description: 'Bank details for payouts' }]
      : []),
    { id: 'subscription', label: 'Subscription', icon: MdOutlineWorkspacePremium, description: 'View plan, upgrade' },
    { id: 'help', label: 'Help & Support', icon: FiHelpCircle, description: 'FAQs, contact support' },
    { id: 'about', label: 'About', icon: HiOutlineExclamationCircle, description: 'Terms, privacy policy, app info' },
  ]

  return (
    <div className="settings-list">
      {settingsMenu.map((setting) => {
        const Icon = setting.icon
        // Check if this setting is active: either by NavLink isActive or if on base /account route with account setting
        const isAccountDefaultActive = location.pathname === '/account' && setting.id === 'account'
        
        // Bookmarks navigate to /bookmarks instead of /account/bookmarks
        const href = setting.id === 'bookmarks' ? '/bookmarks' : `/account/${setting.id}`
        
        return (
          <NavLink 
            key={setting.id} 
            to={href}
            className={({ isActive }) => (isActive || isAccountDefaultActive) ? 'active' : ''}
          >
            <span className="left-side">
              <Icon className="left-icon"/>
              <span className="setting-text">
                <span className="setting-label">{setting.label}</span>
                <span className="setting-description">{setting.description}</span>
              </span>
            </span>
            <LiaAngleRightSolid className="right-icon"/>
          </NavLink>
        )
      })}

      {/* Logout Button */}
      <button className="logout-button" onClick={logout}>
        <span className="left-side">
          <IoLogOutOutline className="left-icon"/>
          <span className="setting-text">
            <span className="setting-label">Logout</span>
          </span>
        </span>
      </button>
    </div>
  )
}

export default SettingsMenu


