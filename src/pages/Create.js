import React from 'react'
import { TabbedNav, PageSetup, Header } from '../exports'
import { RiMessageLine } from 'react-icons/ri'
import { FaRegBell } from 'react-icons/fa'
function Create() {
  const nav = [
    {path: "/create-list", label: "Add a listing"},
    {path: "/post-a-request", label: "Post a request"}
  ]
  return (
    <PageSetup>
       {/*The page to serve tabbed menu for creating both new posts and properties
          (CreatList & CreateRequest), Nested routes to serve both pages as outlets in here.
        */}
        <Header //Top page header
          pageTitle = {<h2>Create</h2>}
          icons = {
            [
              {link: "/inbox", element: <RiMessageLine />},
              {link: "/notifications", element: <FaRegBell />}
            ]
          }
          //button={<ClickButton text="Hello" onClick={() => alert('Clicked!')} />} 
        />
      <div className="main-content">
        <div className="content">
          <TabbedNav tabs={nav} basePath="/create" />
        </div>
        <div className="sidebar">
          {/*Optional for follows and all*/}
          <div className="search-tips">{/* Reused from search.css */}
            <h3>Posting Tips</h3>
            <ul>
              <li>Ensure all required fields are filled</li>
              <li>Enter locations that exist</li>
              <li>Confirm all entered data before submission</li>
            </ul>
          </div>
        </div>
      </div>
    </PageSetup>
  )
}

export default Create
