import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Header.css'
function Header({backIcon, pageTitle, icons, button, menuIcon}){
  const navigate = useNavigate()
  const back = () => {
    navigate(-1)
  }
  return(//{/* TOP BAR of the app. contains logo, login/signup, etc */}
    <div className="header">
      <div className="left">
        {(backIcon) && <span className="icon" onClick={back}>{backIcon}</span>}
        {(pageTitle) && pageTitle} {/*Can take in any element: headers with <h2>, JSX etc*/}
      </div>
      <div className="right">
        {icons.map((item, index) => (
          <span key={index} className="icon icon-right">
            {item.link ? (
              <Link to={item.link}>{item.element}</Link>
            ) : (
              item.element
            )}
          </span>
        ))}
        {(button) && button} {/*Built for buttons but can literally take anything*/}
        {(menuIcon) && <span className="icon icon-right">{menuIcon}</span>}
      </div>
    </div>
  )
}
export default Header
