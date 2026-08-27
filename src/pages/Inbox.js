import React, { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom" 
import axios from "axios"                                   
import { MessageListItem, SearchBar, ChatScreen, PageSetup, Header } from "../exports"
import { FaRegBell } from "react-icons/fa"
import { timeAgo } from "../components/Time"   
import { API_BASE } from '../config/api'             
import "./Inbox.css"

// ========================================================
// Shape mapper — lives outside the component so it's stable.
// ========================================================
const mapConversations = (convos, token) => {
  let myId = null
  try {
    myId = JSON.parse(atob(token.split(".")[1]))?.id
  } catch (_) {}

  return convos.map((c) => {
    const other =
      (c.participants || []).find((p) => String(p._id) !== String(myId)) ||
      c.participants?.[0] ||
      {}

    return {
      id: c._id,
      conversationId: c._id,
      otherUserId: other._id || "",
      avatar: other.avatar || "",
      name: other.fullName || other.username || "User",
      verified: other.kycStatus === "verified",
      lastMessage: c.lastMessage?.text || "",
      timeAgo: c.lastMessageAt ? timeAgo(c.lastMessageAt) : "",
      unread: false,
    }
  })
}

const Inbox = () => {
  const navigate = useNavigate()
  const location = useLocation() // hook, not window.location

  // conversations = source of truth
  // filteredConversations = search-derived view of it
  const [conversations, setConversations] = useState([])
  const [filteredConversations, setFilteredConversations] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true) // declared properly
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const openedAgentIdRef = useRef(null)

  // Fetch all conversations for the logged-in user
  useEffect(() => {
    const fetchConversations = async () => {
      const token = localStorage.getItem("token")
      if (!token) { setIsLoading(false); return }
      try {
        const res = await axios.get(`${API_BASE}/conversations`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        // Map raw API shape before storing — never store unmapped data
        const mapped = mapConversations(res.data.conversations || [], token)
        setConversations((prev) => {
        const fetchedIds = new Set(mapped.map((c) => c.id))
        
        // Keep any conversations Effect B added that the server didn't return yet
        const justAdded = prev.filter((c) => !fetchedIds.has(c.id))
        
        // justAdded goes first so the agent conversation stays at the top
        return [...justAdded, ...mapped]
      })

      setFilteredConversations((prev) => {
        const fetchedIds = new Set(mapped.map((c) => c.id))
        const justAdded = prev.filter((c) => !fetchedIds.has(c.id))
        return [...justAdded, ...mapped]
      })
      } catch (err) {
        console.error("Failed to fetch conversations:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchConversations()
  }, [])

  // Auto-open a conversation when ?agentId= is in the URL
  // Triggered by the "Contact Agent" button on OrderPreview.
  useEffect(() => {
    const agentId = new URLSearchParams(location.search).get("agentId")
    if (!agentId) return
    if (openedAgentIdRef.current === agentId) return

    const token = localStorage.getItem("token")
    if (!token) return

    const open = async () => {
      try {
        const res = await axios.post(
          `${API_BASE}/conversations`,
          { recipientId: agentId },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        // mapConversations always returns an array — destructure the first item
        const [chat] = mapConversations([res.data.conversation], token) // ← fixed

        // Prepend only if not already in the list, then select it
        setConversations((prev) => {
          const exists = prev.find((c) => c.id === chat.id)
          return exists ? prev : [chat, ...prev]
        })
        setSelectedChat(chat)

        // On mobile, navigate into the chat screen directly
        if (isMobile) {
          navigate(`/chat/${chat.id}`, { state: { chat } })  // pass the chat data to avoid refetching in ChatScreen
        }
        openedAgentIdRef.current = agentId
      } catch (err) {
        console.error("Failed to open agent conversation:", err)
      }
    }
    open()
  }, [location.search, isMobile, navigate])

  // Respond to window resizing
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Search filters against conversations
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredConversations(conversations)
      return
    }
    const q = searchQuery.toLowerCase()
    setFilteredConversations(
      conversations.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.lastMessage.toLowerCase().includes(q)
      )
    )
  }, [searchQuery, conversations])

  // Select a chat and mark it read 
  const handleSelectChat = (chat) => {
    setSelectedChat(chat)
    // Mark as read in the source array — filtered view re-derives automatically
    setConversations((prev) =>
      prev.map((c) => (c.id === chat.id ? { ...c, unread: false } : c))
    )
    if (isMobile) navigate(`/chat/${chat.id}`, { state: { chat } })
  }

  return (
    <PageSetup>
      <Header
        pageTitle={<h2>Messages</h2>}
        icons={[{ link: "/notifications", element: <FaRegBell /> }]}
      />

      <div className="main-content">
        <div className="content">
          <div className="inbox-layout">

            {/* ── Left panel: conversation list ── */}
            <div className={`inbox-sidebar ${selectedChat && !isMobile ? "has-selection" : ""}`}>
              <div className="inbox-search">
                <SearchBar
                  placeholder="Search messages..."
                  onSearch={(q) => setSearchQuery(q)}
                />
              </div>

              <div className="inbox-message-list">
                {isLoading ? (
                  <div className="inbox-loading">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="skeleton skeleton-message-item" />
                    ))}
                  </div>
                ) : filteredConversations.length > 0 ? (  // ← filteredConversations
                  filteredConversations.map((convo) => (
                    <MessageListItem
                      key={convo.id}
                      {...convo}
                      onClick={() => handleSelectChat(convo)}
                    />
                  ))
                ) : (
                  <div className="inbox-empty-search">
                    <p>No conversations found</p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Right panel: active chat or placeholder ── */}
            {!isMobile && (
              <div className="inbox-chat-panel">
                {selectedChat ? (
                  <ChatScreen
                    chat={selectedChat}
                    onBack={() => setSelectedChat(null)}
                    embedded={true}
                  />
                ) : (
                  <div className="inbox-empty-state">
                    <div className="empty-icon">💬</div>
                    <h3>Your Messages</h3>
                    <p>Select a conversation to start chatting</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageSetup>
  )
}

export default Inbox
