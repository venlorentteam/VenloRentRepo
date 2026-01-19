import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { MdKeyboardBackspace } from "react-icons/md"
import './Header.css'
function Header({backIcon = false, pageTitle, icons = [], button, menuIcon={}}){
  const navigate = useNavigate()
  const back = () => {
    navigate(-1)
  }
  return(//{/* TOP BAR of the app. contains logo, login/signup, etc */}
    <div className="header">
      <div className="left">
      {/*For items to be on the left hand side*/}
        <div>{(backIcon) && <span className="icon" onClick={back}><MdKeyboardBackspace /></span>}</div>
        {(pageTitle) && pageTitle} {/*Can take in any element: headers with <h2>, JSX etc*/}
      </div>
      <div className="right">
        {/*For items to be on the left hand side*/}
        {icons.map((item, index) => (//Icons on the left that don't don't show on desktop
          <span key={index} className="icon icon-right">
            {item.link 
              ? <Link to={item.link}>{item.element}</Link>
              : item.element
            }
          </span>
        ))}
        {(button) && button} {/*Built for buttons but can literally take anything*/}
        {menuIcon?.element && (
          <span className="icon">{/*Hamburger menu mostly*/}
            {menuIcon.link
              ? <Link to={menuIcon.link}>{menuIcon.element}</Link>
              : menuIcon.element
            }
          </span>
        )}
      </div>
    </div>
  )
}
export default Header
