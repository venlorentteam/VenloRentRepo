import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Header,
  ClickButton,
  PageSetup,
  PropertyCard,
  RequestCard,
  UpgradeWidget,
} from '../exports'
import { RiMessageLine, RiAddCircleLine } from 'react-icons/ri'
import { FaRegBell } from 'react-icons/fa'
import '../assets/css/global.css'
import './Dashboard.css'
import propertyImg1 from '../assets/img/house-isolated-field.jpg'
import propertyImg2 from '../assets/img/3d-rendering-house-model.jpg'

// ─────────────────────────────────────────────────────────────────────────────
//  MOCK CURRENT USER
//  Replace with your real auth context when ready, e.g: const { user } = useAuth()
//  isAgent   → KYC completed, controls agent compose footer in RequestResponsesModal
//  isPremium → paid plan, controls premium badge display
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_CURRENT_USER = {
  id:        'current-user-001',
  name:      'Obinabo Walter',
  handle:    '@walcode',
  avatar:    'https://i.pravatar.cc/100?img=1',
  isAgent:   false,   // flip to true to see agent compose footer inside modal
  isPremium: false,
}

const MOCK_FEED = [
  // ── LISTING 1 ────────────────────────────────────────────────────────────
  {
    type:        'listing',
    isFollowing: true,         // current user follows this agent
    id:          'lst-001',
    avatar:      'https://i.pravatar.cc/100?img=1',
    username:    'Obinabo Walter',
    handle:      '@walcode',
    verified:    true,
    time:        '2h ago',
    image:       [propertyImg2, propertyImg1],
    price:       '₦700,000',
    location:    'Gwagwalada, Abuja',
    category:    'Apartment',
    views:       '10k',
    comments:    '532',
    bookmarked:  false,
    description: 'Self contained apartment, with steady water and light. Very secure environment with 24/7 security.',
  },

  // ── REQUEST 1 ────────────────────────────────────────────────────────────
  {
    type:          'request',
    isFollowing:   false,
    id:            'req-001',
    avatar:        'https://i.pravatar.cc/100?img=9',
    username:      'Amara Obi',
    handle:        '@amaraobi',
    isAgent:       true,
    isPremium:     true,
    time:          '2 hrs ago',
    description:   'Looking for a clean 2-bedroom flat in Wuse 2 or Maitama. Preferably ground floor with steady electricity and water. Ready to move in by end of the month.',
    category:      'Flat',
    location:      'Wuse 2 / Maitama, Abuja',
    budget:        '₦600k – ₦900k/yr',
    likes:         '48',
    liked:         false,
    responseCount: '3',
    bookmarked:    false,
    expired:       false,
    daysLeft:      27,
    agentResponses: [
      {
        id:        'ar-001',
        avatar:    'https://i.pravatar.cc/100?img=12',
        name:      'Emeka Realty',
        handle:    '@emekarealty',
        isAgent:   true,
        isPremium: true,
        text:      'I have a 2-bed ground floor flat in Wuse 2. Fitted kitchen, 24hr security, borehole. Available immediately.',
        listingSnapshot: {
          price:    '₦800,000/yr',
          location: 'Wuse 2, Abuja',
          image:    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=120&q=80',
        },
        time: '45 min ago',
      },
      {
        id:        'ar-002',
        avatar:    'https://i.pravatar.cc/100?img=33',
        name:      'Grace Homes',
        handle:    '@gracehomes',
        isAgent:   true,
        isPremium: false,
        text:      'Maitama option — 1st floor flat, solar backup + borehole. ₦750k/yr, negotiable for a good tenant.',
        listingSnapshot: {
          price:    '₦750,000/yr',
          location: 'Maitama, Abuja',
          image:    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=120&q=80',
        },
        time: '1 hr ago',
      },
      {
        id:        'ar-003',
        avatar:    'https://i.pravatar.cc/100?img=55',
        name:      'Crown Realtors',
        handle:    '@crownrealtors',
        isAgent:   true,
        isPremium: false,
        // No listingSnapshot — text-only response, chip won't render
        text:      'I have 2 units in Wuse 2 — ground floor ₦650k and 1st floor ₦620k. EKEDC meter. Can show you this weekend.',
        time: '2 hrs ago',
      },
    ],
    discussionItems: [
      {
        id:        'dc-001',
        avatar:    'https://i.pravatar.cc/100?img=7',
        name:      'Tunde Balogun',
        handle:    '@tundeb',
        isAgent:   false,
        isPremium: false,
        comment:   'Emeka Realty is solid — helped me find my place in Wuse 2 last year.',
        likeCount: 12,
        time:      '30 min ago',
      },
      {
        id:        'dc-002',
        avatar:    'https://i.pravatar.cc/100?img=18',
        name:      'Chioma Nwachukwu',
        handle:    '@chiomaN',
        isAgent:   false,
        isPremium: true,
        comment:   'Also looking for something similar! Would love to know what you find 👀',
        likeCount: 4,
        time:      '1 hr ago',
      },
    ],
  },

  // ── LISTING 2 ────────────────────────────────────────────────────────────
  {
    type:        'listing',
    isFollowing: true,
    id:          'lst-002',
    avatar:      'https://i.pravatar.cc/100?img=5',
    username:    'Jay Carlos',
    handle:      '@jaycarlx',
    verified:    true,
    time:        '5h ago',
    image:       [propertyImg1],
    price:       '₦1,200,000',
    location:    'Lekki Phase 1, Lagos',
    category:    'Duplex',
    views:       '25k',
    comments:    '1.2k',
    bookmarked:  true,
    description: 'Luxury 4-bedroom duplex with swimming pool, gym, and 24/7 power supply.',
  },

  // ── REQUEST 2 ────────────────────────────────────────────────────────────
  {
    type:          'request',
    isFollowing:   true,
    id:            'req-002',
    avatar:        'https://i.pravatar.cc/100?img=21',
    username:      'Kelechi Eze',
    handle:        '@kelechi_e',
    isAgent:       true,
    isPremium:     true,
    time:          '5 hrs ago',
    description:   'Need a furnished shortlet studio in Victoria Island for 3 months. Fast WiFi, 24/7 power backup, and on-site security. Flexible on exact location within VI.',
    category:      'Studio',
    location:      'Victoria Island, Lagos',
    budget:        '₦150k – ₦200k/mo',
    likes:         '22',
    liked:         false,
    responseCount: '1',
    bookmarked:    false,
    expired:       false,
    daysLeft:      14,
    agentResponses: [
      {
        id:        'ar-004',
        avatar:    'https://i.pravatar.cc/100?img=47',
        name:      'Lagos Stays',
        handle:    '@lagosstays',
        isAgent:   true,
        isPremium: true,
        text:      'Fully furnished studio in VI — solar inverter, 200mbps WiFi, 24hr security. ₦180k/mo all inclusive.',
        listingSnapshot: {
          price:    '₦180,000/mo',
          location: 'Victoria Island, Lagos',
          image:    'https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=120&q=80',
        },
        time: '3 hrs ago',
      },
    ],
    discussionItems: [],
  },

  // ── LISTING 3 ────────────────────────────────────────────────────────────
  {
    type:        'listing',
    isFollowing: false,
    id:          'lst-003',
    avatar:      'https://i.pravatar.cc/100?img=8',
    username:    'Grace Homes',
    handle:      '@gracehomes',
    verified:    false,
    time:        '1d ago',
    image:       [propertyImg2],
    price:       '₦450,000',
    location:    'Kubwa, Abuja',
    category:    'Studio',
    views:       '5k',
    comments:    '120',
    bookmarked:  false,
    description: 'Affordable studio apartment perfect for young professionals.',
  },

  // ── REQUEST 3 — expired, tests expired card state ─────────────────────────
  {
    type:          'request',
    isFollowing:   false,
    id:            'req-003',
    avatar:        'https://i.pravatar.cc/100?img=29',
    username:      'Yusuf Musa',
    handle:        '@yusufm',
    isAgent:       true,
    isPremium:     true,
    time:          '31 days ago',
    description:   'Was looking for a 3-bedroom apartment in Gwarinpa with a good estate. Found one — thanks to everyone who responded!',
    category:      'Apartment',
    location:      'Gwarinpa, Abuja',
    budget:        '₦500k – ₦700k/yr',
    likes:         '89',
    liked:         true,
    responseCount: '6',
    bookmarked:    true,
    expired:       true,   // tests disabled state — stripe grey, chips muted, Closed btn
    daysLeft:      null,
    agentResponses:  [],
    discussionItems: [],
  },
]

// ========================================================
//  MAIN DASHBOARD COMPONENT
// ========================================================
function Dashboard() {
  const navigate = useNavigate()

  // === Feed state =========
  const [feed, setFeed]      = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Replace the setTimeout + MOCK_FEED with your real API call:
  //   const res  = await fetch(`/api/feed?tab=${activeTab}`)
  //   const data = await res.json()
  //   setFeed(data)
  useEffect(() => {
  setIsLoading(true)
  setTimeout(() => {
    setFeed(MOCK_FEED)   // always the full mixed feed
    setIsLoading(false)
  }, 1000)
}, [])

  // === Navigation handlers ===
  const handleCreatePost = () => navigate('/create/post-a-request')
  const handleOrder      = (id) => navigate(`/listing/${id}/order`)
  const handleRespond    = (id) => navigate(`/requests/${id}/respond`)

  return (
    <PageSetup>
      <Header
        pageTitle={<h2>Home</h2>}
        icons={[
          { link: '/inbox',         element: <RiMessageLine /> },
          { link: '/notifications', element: <FaRegBell />     },
        ]}
        button={
          <ClickButton
            text="Create"
            icon={<RiAddCircleLine />}
            onClick={handleCreatePost}
            variant="primary"
            size="medium"
          />
        }
      />

      <div className="main-content">
        <div className="content">

          {/* ====== FEED CONTENT AREA ======
              Three states: loading → items → empty.
              Both PropertyCard and RequestCard render in the same loop —
              item.type decides which component to use.
          ── */}
          {isLoading ? (
            <div className="feed-loading">
              <div className="skeleton skeleton-card"></div>
              <div className="skeleton skeleton-card"></div>
              <div className="skeleton skeleton-card"></div>
            </div>

          ) : feed.length > 0 ? (

            // Mixed feed — one loop, two card types
            feed.map(item =>
              item.type === 'listing' ? (

                // PropertyCard 
                <PropertyCard
                  key={item.id}
                  {...item}
                  onOrder={() => handleOrder(item.id)}
                />

              ) : (

                // RequestCard — mirrors PropertyCard usage above.
                // currentUserIsAgent from MOCK_CURRENT_USER —
                // replace with user.isAgent from your auth context when ready
                <RequestCard
                  key={item.id}
                  {...item}
                  currentUserIsAgent={MOCK_CURRENT_USER.isAgent}
                  onRespond={() => handleRespond(item.id)}
                />

              )
            )

          ) : (

            // Empty state — tab-aware message
            <div className="feed-empty">
              {/* <div className="empty-icon">🏠</div> */}
              <h3>No posts yet</h3>
              <p>Be the first to post a property or a request!</p>
              <ClickButton
                text="Create Post"
                onClick={handleCreatePost}
                variant="primary"
              />
            </div>

          )}
        </div>

        {/* === Sidebar === */}
        <div className="sidebar">
          <UpgradeWidget
            title="Become a Verified Agent"
            text="Get verified to list properties and connect with more clients!"
            features={[
              'List unlimited properties',
              'Get verified badge',
              'Priority support',
              'Boost your listings',
            ]}
            onClick={() => navigate('/account/verification')}
          />
        </div>
      </div>
    </PageSetup>
  )
}

export default Dashboard