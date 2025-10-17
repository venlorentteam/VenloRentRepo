import React from 'react'
import "./PrelimHeader.css"
function PrelimHeader({pageTitle}) {
  return (
    <div>
      {/* /* Should contain logo and page title for preliminary pages */}
      <img className="login-logo-img" src="https://i.pravatar.cc/100" alt="Logo" />
      <h2 className="page-title">{pageTitle} </h2>
    </div>
  )
}

export default PrelimHeader
