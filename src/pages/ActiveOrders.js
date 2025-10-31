import React from 'react'
import { OrderList } from '../exports'

function ActiveOrders() { const item = {
    date: "2025-10-31",
    time: "08:31",
    status: "Pending",
    amount: "500,000 NGN",
    commission: "100,000 NGN",
    no: 28489302472,
    agent: "Molokwu Christian"
  }
  return ( 
    <>
      <OrderList order={item} />
    </>
  )
}

export default ActiveOrders
