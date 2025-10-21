import React from 'react'
import "./PageSetup.css"

const PageSetup = ({children}) => {
  return (
    <div className="app">
        <div className="main-area">
            {children}
        </div>
    </div>
  )
}

export default PageSetup