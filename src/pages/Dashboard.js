import React from 'react'
import { SideNav, Header, IconNav, ClickButton, PageSetup } from '../exports'
import { RiMessageLine } from 'react-icons/ri'
import { FaRegBell } from 'react-icons/fa'
import '../assets/css/global.css'

function Dashboard() {
const modalContents = [
  {modalTitle: "Warning", modalText: "This is just a warning that you should adhere to"},
  {modalText: "Don't make a mistake"}
]
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
      </div>
      <div className="sidebar">
        {/*Optional for follows and all*/}
      </div>
      <IconNav />{/*Mobile bottom navigation*/}
    </PageSetup>
  )
}

export default Dashboard
