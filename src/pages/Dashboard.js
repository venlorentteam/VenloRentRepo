import React from 'react'
import { SideNav, Header, IconNav, ClickButton, PageSetup, PropertyCard } from '../exports'
import { RiMessageLine } from 'react-icons/ri'
import { FaRegBell } from 'react-icons/fa'
import '../assets/css/global.css'
import propertyImg from '../assets/img/house-isolated-field.jpg'
import propertyImg2 from '../assets/img/3d-rendering-house-model.jpg'
function Dashboard() {
const img = [propertyImg2]
  return (
    <PageSetup>
      <SideNav />{/*Desktop left-side navigation*/}
      <Header //Top page header
        pageTitle= {<h2>Dashboard</h2>}
        icons={
          [
            {link: "/messages", element: < RiMessageLine />},
            {link: "/notifications", element: < FaRegBell />}
          ]
        }
        button={<ClickButton text="Hello" onClick={() => alert('Clicked!')} />} 
      />
      <div className="content">
        {/*To contain property and post cards*/}
        <PropertyCard image={img} />
        <PropertyCard image={img} />
      </div>
      <div className="sidebar">
        {/*Optional for follows and all*/}
      </div>
      <IconNav />{/*Mobile bottom navigation*/}
    </PageSetup>
  )
}

export default Dashboard
