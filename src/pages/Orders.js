import React from 'react'
import { SideNav, Header, IconNav, PageSetup } from '../exports'
import { RiMessageLine } from 'react-icons/ri'
import { FaRegBell } from 'react-icons/fa'
function Orders() {
  return (
    <PageSetup> {/* Will display two types of others (Active and All) in tabbed nav */}
      <SideNav />{/*Desktop left-side navigation*/}
      <Header //Top page header
        pageTitle= {<h2>Orders</h2>}
        icons={
          [
            {link: "/messages", element: < RiMessageLine />},
            {link: "/notifications", element: < FaRegBell />}
          ]
        }
        //button={<ClickButton text="Hello" onClick={() => alert('Clicked!')} />} 
      />
      <div className="content">
        {/*To contain orders of the user*/}
        
      </div>
      <div className="sidebar">
        {/*Optional for follows and all*/}
      </div>
      <IconNav />{/*Mobile bottom navigation*/}
    </PageSetup>
  )
}

export default Orders
