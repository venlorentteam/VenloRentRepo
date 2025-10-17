import React from 'react'
import { SideNav, Header, IconNav, ClickButton } from '../exports'
import { RiMessageLine,} from 'react-icons/ri'
import { FaRegBell } from 'react-icons/fa'
import '../assets/css/global.css'

function Dashboard() {

  return (
    <>
      <SideNav />
      <Header 
        pageTitle= {<h2>Dashboard</h2>}
        icons={
          [
            {link: "/messages", element: < RiMessageLine />},
            {link: "/notifications", element: < FaRegBell />}
          ]
        } 
        button={<ClickButton 
        text="Hello" onClick={() => alert('Clicked!')} />} 
      />
      <IconNav />
    </>
  )
}

export default Dashboard
