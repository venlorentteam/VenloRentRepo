import React from 'react'
import { SideNav, Header, IconNav, ClickButton, Modal } from '../exports'
import { RiMessageLine } from 'react-icons/ri'
import { FaRegBell } from 'react-icons/fa'
import '../assets/css/global.css'

function Dashboard() {
const modalContents = [
  {modalTitle: "Warning", modalText: "This is just a warning that you should adhere to"},
  {modalText: "Don't make a mistake"}
]
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
        // button={<ClickButton 
        // text="Hello" onClick={() => alert('Clicked!')} />} 
      />
      
      <Modal data={modalContents}/> 
      <IconNav />
    </>
  )
}

export default Dashboard
