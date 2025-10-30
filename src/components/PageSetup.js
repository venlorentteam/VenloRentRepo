import React from 'react'
import "./PageSetup.css"
import { SideNav, IconNav } from '../exports'
const PageSetup = ({children}) => {
  return (
    <div className="app">
      <SideNav />{/*Desktop left-side navigation*/}
      <div className="main-area">
        {children}
      </div>
      <IconNav />{/*Mobile bottom navigation*/}
    </div>
  )
}

export default PageSetup