import React from 'react'
import '../assets/css/global.css'
import { Header, PageSetup, TabbedNav } from '../exports'
import { RiMessageLine } from 'react-icons/ri'
import { FaRegBell } from 'react-icons/fa'
function Orders() {
  const tabbed = [
    {path: "/all-orders", label: "All"},
    {path: "/active-orders", label: "Active"}
  ]
  return (
    <PageSetup> {/* Will display two types of others (Active and All) in tabbed nav */}
        <Header //Top page header
          pageTitle= {<h2>Orders</h2>}
          icons={
            [
              {link: "/inbox", element: < RiMessageLine />},
              {link: "/notifications", element: < FaRegBell />}
            ]
          }
          //button={<ClickButton text="Hello" onClick={() => alert('Clicked!')} />} 
        />
      <div className="main-content">
        <div className="content">
          {/*To contain orders of the user*/}
          <TabbedNav tabs={tabbed} basePath="/orders" />
        </div>
        <div className="sidebar">
          {/*Optional for follows and all*/}
        </div>
      </div>
    </PageSetup>
  )
}

export default Orders
