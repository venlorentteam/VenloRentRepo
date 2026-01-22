import React from 'react'
import { NavLink } from 'react-router-dom'
import { GoHome, GoHomeFill } from 'react-icons/go'
import { RiShoppingBag3Fill, RiShoppingBag3Line, RiSearchLine, RiSearchFill, RiMessageLine, RiMessageFill } from 'react-icons/ri'
import { FaRegBell, FaBell } from 'react-icons/fa'
import { MdBookmark, MdBookmarkBorder } from 'react-icons/md'
import { FaRegSquarePlus, FaSquarePlus } from 'react-icons/fa6'
import { FaRegUserCircle, FaUserCircle } from 'react-icons/fa'
import './SideNav.css'

function SideNav() {
  return (
    <nav className="side-nav" aria-label="Main navigation">
      {/* Logo */}
      <div className="nav-logo">
        <img className="logo-img" src="https://i.pravatar.cc/100" alt="LeasePal" />
        <span className="logo-text">VenloRent</span>
      </div>

      {/* Main Navigation Links */}
      <div className="nav-links">
        <NavLink to="/dashboard" className="nav-link">
          {({ isActive }) => (
            <>
              <span className="nav-icon">
                {isActive ? <GoHomeFill /> : <GoHome />}
              </span>
              <span className="nav-text">Home</span>
            </>
          )}
        </NavLink>

        <NavLink to="/search" className="nav-link">
          {({ isActive }) => (
            <>
              <span className="nav-icon">
                {isActive ? <RiSearchFill /> : <RiSearchLine />}
              </span>
              <span className="nav-text">Search</span>
            </>
          )}
        </NavLink>

        <NavLink to="/notifications" className="nav-link">
          {({ isActive }) => (
            <>
              <span className="nav-icon">
                {isActive ? <FaBell /> : <FaRegBell />}
              </span>
              <span className="nav-text">Notifications</span>
            </>
          )}
        </NavLink>

        <NavLink to="/inbox" className="nav-link">
          {({ isActive }) => (
            <>
              <span className="nav-icon">
                {isActive ? <RiMessageFill /> : <RiMessageLine />}
              </span>
              <span className="nav-text">Messages</span>
            </>
          )}
        </NavLink>

        <NavLink to="/orders" className="nav-link">
          {({ isActive }) => (
            <>
              <span className="nav-icon">
                {isActive ? <RiShoppingBag3Fill /> : <RiShoppingBag3Line />}
              </span>
              <span className="nav-text">Orders</span>
            </>
          )}
        </NavLink>

        <NavLink to="/bookmarks" className="nav-link">
          {({ isActive }) => (
            <>
              <span className="nav-icon">
                {isActive ? <MdBookmark /> : <MdBookmarkBorder />}
              </span>
              <span className="nav-text">Bookmarks</span>
            </>
          )}
        </NavLink>

        <NavLink to="/create/post-a-request" className="nav-link">
          {({ isActive }) => (
            <>
              <span className="nav-icon">
                {isActive ? <FaSquarePlus /> : <FaRegSquarePlus />}
              </span>
              <span className="nav-text">Create</span>
            </>
          )}
        </NavLink>
      </div>

      {/* Bottom Navigation (Profile/Account) */}
      <div className="nav-bottom">
        <NavLink to="/profile" className="nav-link">
          {({ isActive }) => (
            <>
              <span className="nav-icon">
                {isActive ? <FaUserCircle /> : <FaRegUserCircle />}
              </span>
              <span className="nav-text">Profile</span>
            </>
          )}
        </NavLink>

        <NavLink to="/account" className="nav-link nav-link-account">
          <img 
            src="https://i.pravatar.cc/50" 
            className="profile-avatar" 
            alt="Your account" 
          />
          <span className="nav-text">Account</span>
        </NavLink>
      </div>
    </nav>
  )
}

export default SideNav