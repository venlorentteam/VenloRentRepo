import React from 'react'
import { OrderList } from '../exports'

function AllOrders() {
  const item = {
    date: "2025-10-31",
    time: "08:31",
    status: "Failed",
    amount: "500,000 NGN",
    commission: "100,000 NGN",
    no: 28489302472,
    agent: "Jane Doe"
  }
  return ( 
    <>
      <OrderList order={item} />
      <OrderList order={item} />
    </>
  )
}
export default AllOrders
