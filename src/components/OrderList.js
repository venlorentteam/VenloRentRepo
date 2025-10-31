import React from 'react'
import './OrderList.css'
//OrderList takes an object prop probably order={}
function OrderList({order = {}}){
  const statusClasses = {
    Completed: "completed",
    Failed: "failed",
    Pending: "pending",
  };
  return (
    <div className='order-container'>
      {/* list of orders made by user. seen on ACTIVE ORDER PAGE */}
      <div className="item">
        <div className="left">
          <h1>Rent Order</h1>
          <p className="date-time">{order.date}  {order.time}</p>
        </div>
        <p className={`normal ${statusClasses[order.status] || ""}`}>{order.status}</p>
      </div>      
      <hr/>
      <div className="item">
        <div className="left">
          <p className='normal'>Amount</p>
        </div>
        <h1>{order.amount}</h1>
      </div> 
      <div className="item">
        <div className="left">
          <p className='normal'>Commission</p>
        </div>
        <h2>{order.commission}</h2>
      </div> 
      <div className="item">
        <div className="left">
          <p className='normal'>Order No.</p>
        </div>
        <h2>{order.no}</h2>
      </div> 
       <div className="item">
        <div className="left">
          <p className='normal'>Agent</p>
        </div>
        <h2>{order.agent}</h2>
      </div>
    </div>
  )
}

export default OrderList
