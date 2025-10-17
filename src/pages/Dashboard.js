import React from 'react'
import { SideNav, Header, IconNav, ClickButton } from '../exports'
import { IoArrowBack } from "react-icons/io5"
import { RiMessageLine,} from 'react-icons/ri'
import { FaRegBell } from 'react-icons/fa'
import '../assets/css/global.css'

function Dashboard() {

  return (
    <>
      <SideNav />
      <Header 
        // backIcon={<IoArrowBack />} 
        pageTitle="Dashboard" 
        icons={
          [
            {link: "/messages", element: < RiMessageLine />},
            {link: "/notifications", element: < FaRegBell />}
          ]
        } 
        button={<ClickButton 
        text="Hello" onClick={() => alert('Clicked!')} />} />
      <IconNav />
    </>
  )
}

export default Dashboard
