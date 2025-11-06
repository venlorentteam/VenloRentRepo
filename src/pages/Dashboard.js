import React from 'react'
import { Header, ClickButton, PageSetup, PropertyCard } from '../exports'
import { RiMessageLine } from 'react-icons/ri'
import { FaRegBell } from 'react-icons/fa'
import '../assets/css/global.css'
// import propertyImg from '../assets/img/house-isolated-field.jpg'
import propertyImg2 from '../assets/img/3d-rendering-house-model.jpg'
function Dashboard() {
const img = [propertyImg2]
  return (
    <PageSetup>
        <Header //Top page header
          pageTitle= {<h2>Dashboard</h2>}
          icons={
            [
              {link: "/inbox", element: < RiMessageLine />},
              {link: "/notifications", element: < FaRegBell />}
            ]
          }
          button={<ClickButton text="Hello" onClick={() => alert('Clicked!')} />} 
        />
        <div className="main-content">
          <div className="content">
            {/*To contain property and post cards*/}
            <PropertyCard image={img} />
            <PropertyCard image={img} />
          </div>
          <div className="sidebar">
            {/*Optional for follows and all*/}
          </div>
      </div>
    </PageSetup>
  )
}

export default Dashboard
