import React from 'react'
import {NavLink} from 'react-router-dom'
import './IconNav.css'
import { GoHome, GoHomeFill } from 'react-icons/go'
import { RiShoppingBag3Fill,  RiShoppingBag3Line, RiSearchLine, RiSearchFill } from 'react-icons/ri'
import { FaRegSquarePlus, FaSquarePlus } from 'react-icons/fa6'
import { FaRegUserCircle, FaUserCircle } from 'react-icons/fa'
function IconNav() {
  return (
    <div className="icon-nav">
      {/* Mobile Navigation  */}
      <NavLink to="/dashboard">
        {({ isActive }) => (
          <>
            <span className="icon">
              {isActive ? <GoHomeFill /> : <GoHome />}
            </span>
          </>
        )}
      </NavLink>
      <NavLink to="/search">
        {({ isActive }) => (
          <>
            <span className="icon">
              {isActive ? <RiSearchFill /> : <RiSearchLine />}
            </span>
          </>
        )}
      </NavLink>
      <NavLink to="/create">
        {({ isActive }) => (
          <>
            <span className="icon">
              {isActive ? <FaSquarePlus /> : <FaRegSquarePlus />}
            </span>
          </>
        )}
      </NavLink>
      <NavLink to="/orders">
        {({ isActive }) => (
          <>
            <span className="icon">
              {isActive ? <RiShoppingBag3Fill /> : <RiShoppingBag3Line />}
            </span>
          </>
        )}
      </NavLink>
      <NavLink to="/profile">
        {({ isActive }) => (
          <>
            <span className="icon">
              {isActive ? <FaUserCircle /> : <FaRegUserCircle />}
            </span>
          </>
        )}
      </NavLink>
    </div>
    
  )
}

export default IconNav
