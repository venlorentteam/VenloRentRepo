import React from 'react'
import { PageSetup, Header, SearchBar, SearchDisplayCard } from '../exports'

function Search() {
  return (
    <PageSetup>
      <Header //Top page header
        pageTitle= {<h2>Search</h2>}
        // icons={
        //   [
        //     {link: "/messages", element: < RiMessageLine />},
        //     {link: "/notifications", element: < FaRegBell />}
        //   ]
        // }
      />
    <div className="main-content">
      <div className="content">
        {/*To Search property and post cards*/}
        <SearchBar />
        <SearchDisplayCard
          username="@dimma"
          price="₦850,000"
          location="Lekki, Lagos"
          orders={125}
          successRate="92%"
          houseType="Studio Apartment"
          imageUrl="https://i.pravatar.cc/100?img"
        />
        <SearchDisplayCard
          username="@dimma"
          price="₦850,000"
          location="Lekki, Lagos"
          orders={125}
          successRate="92%"
          houseType="Studio Apartment"
          imageUrl="https://i.pravatar.cc/100?img"
        />
      </div>
      <div className="sidebar">
        {/*Optional for follows and all*/}
      </div>
    </div>
    </PageSetup>
  )
}

export default Search
