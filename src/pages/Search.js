import React from 'react'
import { SearchDisplayCard } from '../exports'

function Search() {
  return (
    <div>
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
  )
}

export default Search
