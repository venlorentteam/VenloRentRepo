import React from 'react'
import "./PrelimHeader.css"
function PrelimHeader({pageTitle, pageSubTitle}) {
  return (
    <div>
      {/* /* Should contain logo and page title for preliminary pages */}
      <img className="login-logo-img" src="https://i.pravatar.cc/100" alt="Logo" />
      {pageTitle && <h2 className="page-title">{pageTitle} </h2>}
      {pageSubTitle && <h4 className="page-sub-title">{pageSubTitle} </h4>}
    </div>
  )
}

export default PrelimHeader
