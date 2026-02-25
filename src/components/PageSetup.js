import React from 'react'
import "./PageSetup.css"
import { SideNav, IconNav } from '../exports'

const PageSetup = ({ children }) => {
  return (
    <div className="app">
      {/* Desktop Sidebar Navigation */}
      <SideNav />
      
      {/* Main Content Area */}
      <div className="main-area">
        {children}
      </div>
      
      {/* Mobile Bottom Navigation */}
      <IconNav />
    </div>
  )
}

export default PageSetup