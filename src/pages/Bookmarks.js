import React from 'react'
import { SideNav, Header, IconNav, PageSetup } from '../exports'
import { RiMessageLine } from 'react-icons/ri'
import { FaRegBell } from 'react-icons/fa'
function Bookmarks() {
  return (
    <PageSetup>
      <SideNav />{/*Desktop left-side navigation*/}
      <Header //Top page header
        pageTitle= {<h2>Bookmarks</h2>}
        icons={
          [
            {link: "/inbox", element: < RiMessageLine />},
            {link: "/notifications", element: < FaRegBell />}
          ]
        }
        //button={<ClickButton text="Hello" onClick={() => alert('Clicked!')} />} 
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

export default Bookmarks
