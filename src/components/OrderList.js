import React from 'react'
import './OrderList.css'
import { FaChevronRight } from 'react-icons/fa'

/**
 * OrderList Component
 * @param {object} order - Order details object
 * @param {function} onClick - Click handler for the order card
 */
function OrderList({ 
  order = {
    type: "Rent Order",
    date: "Jan 15, 2026",
    time: "10:30 AM",
    status: "Pending",
    amount: "₦2,500,000",
    commission: "₦250,000",
    no: "ORD-2024-001234",
    agent: "John Doe Properties"
  },
  onClick
}) {
  const statusClasses = {
    Completed: "order-status-completed",
    Failed: "order-status-failed",
    Pending: "order-status-pending",
    "Payment Pending": "order-status-payment",
  };

  return (
    <div 
      className="order-card" 
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.();
        }
      }}
    >
      {/* Header: Order Type & Status */}
      <div className="order-header">
        <div className="order-title-section">
          <h3 className="order-title">{order.type}</h3>
          <p className="order-datetime">
            {order.date} • {order.time}
          </p>
        </div>
        <span className={`order-status ${statusClasses[order.status] || ""}`}>
          {order.status}
        </span>
      </div>

      {/* Divider */}
      <div className="order-divider" />

      {/* Order Details */}
      <div className="order-details">
        <div className="order-row">
          <span className="order-label">Amount</span>
          <span className="order-value order-amount">{order.amount}</span>
        </div>

        <div className="order-row">
          <span className="order-label">Commission</span>
          <span className="order-value">{order.commission}</span>
        </div>

        <div className="order-row">
          <span className="order-label">Order No.</span>
          <span className="order-value order-number">{order.no}</span>
        </div>

        <div className="order-row">
          <span className="order-label">Agent</span>
          <span className="order-value">{order.agent}</span>
        </div>
      </div>

      {/* Arrow Icon */}
      <FaChevronRight className="order-chevron" aria-hidden="true" />
    </div>
  )
}

export default OrderList