import React, { useEffect, useState } from 'react'
import '../assets/css/global.css'
import { Header, PageSetup, TabbedNav, UpgradeWidget } from '../exports'
import { RiMessageLine } from 'react-icons/ri'
import { FaRegBell } from 'react-icons/fa'
import axios from 'axios'
import { useAuth } from "../context/AuthProvider"
import { API_BASE } from '../config/api'

function Orders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true)
      setError("")
      const token = localStorage.getItem("token")
      if (!token) {
        setOrders([])
        setIsLoading(false)
        return
      }

      try {
        const res = await axios.get(`${API_BASE}/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setOrders(res.data.items || [])
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load orders")
        setOrders([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const tabbed = [
    {path: "/all-orders", label: "All"},
    {path: "/active-orders", label: "Active"}
  ]

  return (
    <PageSetup> {/* Will display two types of others (Active and All) in tabbed nav */}
        <Header //Top page header
          backIcon={true}
          pageTitle= {<h2>Orders</h2>}
          icons={
            [
              {link: "/inbox", element: < RiMessageLine />},
              {link: "/notifications", element: < FaRegBell />}
            ]
          }
          //button={<ClickButton text="Hello" onClick={() => alert('Clicked!')} />} 
        />
      <div className="main-content">
        <div className="content">
          {/*To contain orders of the user*/}
          <TabbedNav
            tabs={tabbed}
            basePath="/orders"
            outletContext={{
              orders,
              isLoading,
              error,
              userId: user?.id || "",
            }}
          />
        </div>
        <div className="sidebar">
          {/*Optional for follows and all*/}
          <UpgradeWidget />
        </div>
      </div>
    </PageSetup>
  )
}

export default Orders
