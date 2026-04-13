import React from 'react'
import { OrderList } from '../exports'
import { useOutletContext } from 'react-router-dom'
import { RiShoppingBag3Fill } from 'react-icons/ri'

function AllOrders() {
  const { orders = [], isLoading, error, userId } = useOutletContext() || {}

  const formatCurrency = (value, currency = "NGN") => {
    const num = Number(value)
    if (!Number.isFinite(num)) return `0 ${currency}`
    return `₦${num.toLocaleString("en-NG")}`
  }

  const mapOrder = (order) => {
    const createdAt = order.createdAt ? new Date(order.createdAt) : new Date()
    const orderNo = order._id ? `ORD-${order._id.toString().slice(-6).toUpperCase()}` : "ORD-UNKNOWN"
    const isBuyer = userId && order.buyer?._id?.toString() === userId.toString()
    const counterparty = isBuyer ? order.seller : order.buyer

    const listingType = order.property?.listing_type || ""
    const typeLabel = listingType
      ? `${listingType.charAt(0).toUpperCase()}${listingType.slice(1)} Order`
      : "Listing Order"

    const statusLabel =
      order.status === "completed"
        ? "Completed"
        : order.status === "cancelled" || order.status === "rejected"
          ? "Failed"
          : order.paymentStatus === "pending_proof"
            ? "Payment Pending"
            : "Pending"

    return {
      type: typeLabel,
      date: createdAt.toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "2-digit" }),
      time: createdAt.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" }),
      status: statusLabel,
      amount: formatCurrency(order.amount, order.currency),
      commission: formatCurrency(order.property?.commission || 0, order.currency),
      no: orderNo,
      agent: counterparty?.fullName || counterparty?.username || "Unknown",
    }
  }

  return ( 
    <div className="search-empty">
      {isLoading ? (
        <p className="comment-time">Loading orders…</p>
      ) : error ? (
        <p className="comment-time">{error}</p>
      ) : orders.length === 0 ? (
        <>
          <div className="empty-icon">
            <RiShoppingBag3Fill size={40} />
          </div>
          <h3>No orders yet</h3>
          <p className='comment-time'>When you place an order to rent or buy a property, it will show up here.</p>
        </>
      ) : (
        orders.map((order) => (
          <OrderList key={order._id} order={mapOrder(order)} />
        ))
      )}
    </div>
  )
}
export default AllOrders
