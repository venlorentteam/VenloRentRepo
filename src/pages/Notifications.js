import React from 'react'
import { PageSetup, Header } from '../exports'
import { RiMessageLine } from 'react-icons/ri'
import '../assets/css/global.css'
function Notifications  () {
  return (
    <PageSetup> {/* Will display two types of others (Active and All) in tabbed nav */}
        <Header //Top page header
          pageTitle= {<h2>Notifications</h2>}
          icons={
            [
              {link: "/inbox", element: <RiMessageLine />}
            ]
          }
          //button={<ClickButton text="Hello" onClick={() => alert('Clicked!')} />} 
        />
      <div className="main-content">
        <div className="content">
          {/*To contain orders of the user*/}

        </div>
        <div className="sidebar">
          {/*Optional for follows and all*/}
        </div>
      </div>
    </PageSetup>
  )
}

export default Notifications