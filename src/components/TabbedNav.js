import React from 'react'
import './TabbedNav.css'
import { NavLink, Outlet } from 'react-router-dom'
function TabbedNav({ tabs = [], basePath, outletContext }){
  //for any two tabbed menu
  //tabs - [{ label: "Create a Post", path: "create" }]
  //Preceed all path links
  return (
    <>
    <div className="tabbed-nav">
      {tabs.map((tab)=>(
        <NavLink to={`${basePath}${tab.path}`}>{tab.label}</NavLink>
      ))}
    </div>
    <Outlet context={outletContext} />
    </>
  )
}

export default TabbedNav
