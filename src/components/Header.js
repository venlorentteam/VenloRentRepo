import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Header.css'
function Header({backIcon, pageTitle, icon1, icon2, button, menu}){
  const navigate = useNavigate()
  const back = () => {
    navigate(-1)
  }
  return(//{/* TOP BAR of the app. contains logo, login/signup, etc */}
    <div className="header">
      <div className="left">
        {(backIcon) && <span className="icon" onClick={back}>{backIcon}</span>}
        {(pageTitle) && <h2>{pageTitle}</h2>}
      </div>
      <div className="right">
        {(icon1) && <span className="icon">{icon1}</span>}
        {(icon2) && <span className="icon">{icon2}</span>}
        {(button) && {button}}
        {(menu) && <span className="icon">{menu}</span>}
      </div>
    </div>
  )
}
export default Header
