import React from 'react'
import { NavLink } from 'react-router-dom'
import { GoHome, GoHomeFill } from 'react-icons/go'
import { RiShoppingBag3Fill,  RiShoppingBag3Line, RiSearchLine, RiSearchFill, RiMessageLine, RiMessageFill} from 'react-icons/ri'
import { FaRegBell, FaBell } from 'react-icons/fa'
import { MdBookmark, MdBookmarkBorder } from 'react-icons/md'
import { FaRegSquarePlus, FaSquarePlus } from 'react-icons/fa6'
import { FaRegUserCircle, FaUserCircle } from 'react-icons/fa'

import './SideNav.css'

function SideNav(){
  return (
    <div className="side-nav">
      {/*Logo placement below*/}
      <img className="logo-img" src="" alt="" />
      {/*For desktop view navigation*/}
      <NavLink to="/dashboard">
        {({ isActive }) => (
          <>
            <span className="icon">
              {isActive ? <GoHomeFill /> : <GoHome />}
            </span>
            <span className="text">Home</span>
          </>
        )}
      </NavLink>
      <NavLink to="/search">
        {({ isActive }) => (
          <>
            <span className="icon">
              {isActive ? <RiSearchFill /> : <RiSearchLine />}
            </span>
            <span className="text">Search</span>
          </>
        )}
      </NavLink>
      <NavLink to="/notifications">
        {({ isActive }) => (
          <>
            <span className="icon">
              {isActive ? <FaBell /> : <FaRegBell />}
            </span>
            <span className="text">Notifications</span>
          </>
        )}
      </NavLink>
        <NavLink to="/inbox">
        {({ isActive }) => (
          <>
            <span className="icon">
              {isActive ? <RiMessageFill /> : <RiMessageLine />}
            </span>
            <span className="text">Messages</span>
          </>
        )}
      </NavLink>
        <NavLink to="/orders">
        {({ isActive }) => (
          <>
            <span className="icon">
              {isActive ? <RiShoppingBag3Fill /> : <RiShoppingBag3Line />}
            </span>
            <span className="text">Orders</span>
          </>
        )}
      </NavLink>
      <NavLink to="/bookmarks">
        {({ isActive }) => (
          <>
            <span className="icon">
              {isActive ? <MdBookmark /> : <MdBookmarkBorder />}
            </span>
            <span className="text">Bookmarks</span>
          </>
        )}
      </NavLink>
      <NavLink to="/create">
        {({ isActive }) => (
          <>
            <span className="icon">
              {isActive ? <FaSquarePlus /> : <FaRegSquarePlus />}
            </span>
            <span className="text">Create</span>
          </>
        )}
      </NavLink>
      <div className="bottom-nav">
        <NavLink to="/profile">
          {({ isActive }) => (
            <>
              <span className="icon">
                {isActive ? <FaUserCircle /> : <FaRegUserCircle />}
              </span>
              <span className="text">Profile</span>
            </>
          )}
        </NavLink>
        <NavLink to="/account">
              <img src="" className="profile-img" alt="Profile" />
              <span className="text">Account</span>
        </NavLink>
      </div>
    </div>
  )
}

export default SideNav