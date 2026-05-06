import React from 'react'
import { useNavigate } from 'react-router-dom'
import { OrderList } from '../exports'
import { useOutletContext } from 'react-router-dom'
import { RiShoppingBag3Fill } from 'react-icons/ri'
import './Orders.css'

function AllOrders() {
  const navigate = useNavigate()
  const { orders = [], isLoading, error } = useOutletContext() || {}

  const formatCurrency = (value, currency = "NGN") => {
    const num = Number(value)
    if (!Number.isFinite(num)) return `0 ${currency}`
    return `₦${num.toLocaleString("en-NG")}`
  }

  const mapOrder = (order) => {
    const createdAt = order.createdAt ? new Date(order.createdAt) : new Date()
    const orderNo = order._id ? `ORD-${order._id.toString().slice(-6).toUpperCase()}` : "ORD-UNKNOWN"
    // const isBuyer = userId && order.buyer?._id?.toString() === userId.toString()
    // const counterparty = isBuyer ? order.seller : order.buyer

    const listingType = order.property?.listing_type || ""
    const typeLabel = listingType
      ? `${listingType.charAt(0).toUpperCase()}${listingType.slice(1)} Order`
      : "Listing Order"

    const statusLabel =
      order.status === "completed"
        ? "Completed"
        : order.status === "pending_proof" || order.paymentStatus === "pending_proof"
          ? "Payment Pending"
        : order.status === "accepted" || order.status === "approved"
          ? "Approved"
        : order.status === "cancelled" || order.status === "rejected"
          ? "Failed"
            : "Pending"

    return {
      type: typeLabel,
      date: createdAt.toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "2-digit" }),
      time: createdAt.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" }),
      status: statusLabel,
      amount: formatCurrency(order.amount, order.currency),
      commission: formatCurrency(order.property?.commission || 0, order.currency),
      no: orderNo,
      agent: order.seller?.fullName || order.seller?.username || "Unknown",
      propertyId: order.property?._id || "",
      orderId: order._id || "",
      paymentStatus: order.paymentStatus || "",
      rawStatus: order.status || "",
      rawOrder: order,
    }
  }

  const handleOrderClick = (order) => {
    if (!order.orderId) return
    navigate(`/orders/${order.orderId}/status`, {
      state: { order, rawOrder: order.rawOrder },
    })
  }

  return ( 
    <div className="orders-view">
      {isLoading ? (
        <div className="orders-state orders-state--loading">
          <p className="orders-state-text">Loading orders…</p>
        </div>
      ) : error ? (
        <div className="orders-state orders-state--error">
          <p className="orders-state-text">{error}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="orders-state orders-state--empty">
          <div className="empty-icon">
            <RiShoppingBag3Fill size={40} />
          </div>
          <h3>No orders yet</h3>
          <p>When you place an order to rent or buy a property, it will show up here.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const mappedOrder = mapOrder(order)
            return (
              <OrderList
                key={order._id}
                order={mappedOrder}
                onClick={() => handleOrderClick(mappedOrder)}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
export default AllOrders
