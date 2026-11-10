import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom'
import AuthProvider from './context/AuthProvider'
// Import *everything* from your new exports.js file
import * as Pages from './exports';
import { usePageTitle } from './exports'

const titleForPath = (pathname) => {
  if (pathname === '/') return 'Home'
  if (pathname === '/login') return 'Log In'
  if (pathname === '/register') return 'Create Account'
  if (pathname === '/email-auth') return 'Verify Email'
  if (pathname === '/password-recovery') return 'Recover Password'
  if (pathname === '/password-reset') return 'Reset Password'
  if (pathname === '/terms') return 'Terms of Service'
  if (pathname === '/privacy-policy') return 'Privacy Policy'
  if (pathname === '/about') return 'About VenloRent'
  if (pathname === '/help') return 'Help Center'
  if (pathname === '/waitlist') return 'Join the Waitlist'
  if (pathname === '/dashboard') return 'Dashboard'
  if (pathname === '/account') return 'Account Settings'
  if (pathname.startsWith('/account/')) {
    const settingTitles = {
      account: 'Account Settings',
      notifications: 'Notification Settings',
      security: 'Security & Privacy',
      bookmarks: 'Saved Properties',
      verification: 'Agent Verification',
      'payment-details': 'Payment Details',
      subscription: 'Subscription',
      help: 'Help & Support',
      about: 'About VenloRent',
    }
    return settingTitles[pathname.split('/')[2]] || 'Account Settings'
  }
  if (pathname === '/orders') return 'Orders'
  if (pathname === '/register') return 'Create Account'
  if (pathname === '/login') return 'Log In'
  if (pathname === '/orders/active-orders') return 'Active Orders'
  if (pathname === '/orders/all-orders') return 'All Orders'
  if (pathname.startsWith('/orders/') && pathname.endsWith('/status')) return 'Order Status'
  if (pathname === '/bookmarks') return 'Saved Properties'
  if (pathname === '/confirm-order') return 'Confirm Order'
  if (pathname === '/create' || pathname === '/create/create-list') return 'Create Listing'
  if (pathname === '/create/post-a-request') return 'Post a Request'
  if (pathname === '/followers') return 'Followers'
  if (pathname === '/following') return 'Following'
  if (pathname === '/chatscreen' || pathname.startsWith('/chat/')) return 'Messages'
  if (pathname === '/inbox') return 'Inbox'
  if (pathname === '/notifications') return 'Notifications'
  if (pathname === '/profile') return 'My Profile'
  if (pathname.startsWith('/profile/')) return 'Profile'
  if (pathname === '/search') return 'Search Properties'
  if (pathname === '/user') return 'User Profile'
  if (pathname === '/order-preview' || (pathname.startsWith('/listing/') && pathname.endsWith('/order'))) return 'Order Preview'
  if (pathname === '/kyc') return 'Identity Verification'
  if (pathname === '/kyc-completed') return 'Verification Status'
  if (pathname === '/onboarding') return 'Get Started'
  if (pathname.startsWith('/listing/')) return null
  return 'Page Not Found'
}

function RouteTitleManager() {
  const { pathname } = useLocation()
  usePageTitle(titleForPath(pathname))
  return null
}

// Now you can use Pages.Account, Pages.Login, etc.
function App() {
  return (
    <>
    <AuthProvider>
      <RouteTitleManager />
      <Routes>
        <Route path="/" element={<Pages.LandingPage />} />
        <Route path="/login" element={<Pages.Login />} />
        <Route path="/register" element={<Pages.Register />} />
        <Route path="/dashboard" element={<Pages.ProtectedRoute><Pages.Dashboard /></Pages.ProtectedRoute>} />
        <Route path="/account" element={<Pages.ProtectedRoute><Pages.Account /></Pages.ProtectedRoute>} >
          <Route index element={<Pages.ProtectedRoute><Pages.SettingsMenu /></Pages.ProtectedRoute>} /> {/* Default settings menu */}
          <Route path=":settingId" element={<Pages.ProtectedRoute><Pages.SettingsDetails /></Pages.ProtectedRoute>} /> {/* Dynamic route for individual settings */}
        </Route>
        <Route path="/orders" element={<Pages.ProtectedRoute><Pages.Orders /></Pages.ProtectedRoute>} >
          <Route index element={<Pages.ProtectedRoute><Pages.AllOrders /></Pages.ProtectedRoute>} />
          <Route path="active-orders" element={<Pages.ProtectedRoute><Pages.ActiveOrders /></Pages.ProtectedRoute>} />
          <Route path="all-orders" element={<Pages.ProtectedRoute><Pages.AllOrders /></Pages.ProtectedRoute>} />
          <Route path=":orderId/status" element={<Pages.ProtectedRoute><Pages.OrderStatus /></Pages.ProtectedRoute>} />
        </Route>
        <Route path="/bookmarks" element={<Pages.ProtectedRoute><Pages.Bookmarks /></Pages.ProtectedRoute>} />
        {/* <Route path="/confirm-order" element={<Pages.ProtectedRoute><Pages.ConfirmOrder /></Pages.ProtectedRoute>} /> */}
        <Route path="/create" element={<Pages.ProtectedRoute><Pages.Create /></Pages.ProtectedRoute>} >
          <Route index element={<Pages.ProtectedRoute><Pages.CreateList /></Pages.ProtectedRoute>} />
          <Route path="create-list" element={<Pages.ProtectedRoute><Pages.CreateList /></Pages.ProtectedRoute>} />
          <Route path="post-a-request" element={<Pages.ProtectedRoute><Pages.CreateRequest /></Pages.ProtectedRoute>} />
        </Route>
        <Route path="/email-auth" element={<Pages.EmailAuth />} />
        <Route path="/followers" element={<Pages.ProtectedRoute><Pages.Followers /></Pages.ProtectedRoute>} />
        <Route path="/following" element={<Pages.ProtectedRoute><Pages.Following /></Pages.ProtectedRoute>} />
        
        <Route path="/chatscreen" element={<Pages.ProtectedRoute><Pages.ChatScreen /></Pages.ProtectedRoute>} />
        <Route path="/chat/:conversationId" element={<Pages.ProtectedRoute><Pages.ChatScreen /></Pages.ProtectedRoute>} />
        <Route path="/inbox" element={<Pages.ProtectedRoute><Pages.Inbox /></Pages.ProtectedRoute>} />
        <Route path="/notifications" element={<Pages.ProtectedRoute><Pages.Notifications /></Pages.ProtectedRoute>} />
        <Route path="/password-recovery" element={<Pages.PasswordRecovery />} />
        <Route path="/password-reset" element={<Pages.PasswordReset />} />
        <Route path="/profile" element={<Pages.ProtectedRoute><Pages.Profile /></Pages.ProtectedRoute>} />
        <Route path="/profile/:userId" element={<Pages.ProtectedRoute><Pages.Profile /></Pages.ProtectedRoute>} />
        <Route path="/search" element={<Pages.ProtectedRoute><Pages.Search /></Pages.ProtectedRoute>} />
        <Route path="/user" element={<Pages.ProtectedRoute><Pages.User /></Pages.ProtectedRoute>} />
        <Route path="/order-preview" element={<Pages.ProtectedRoute><Pages.OrderPreview /></Pages.ProtectedRoute>} />
        <Route path="/listing/:propertyId/order" element={<Pages.ProtectedRoute><Pages.OrderPreview /></Pages.ProtectedRoute>} />
        <Route path="/listing/:slug" element={<Pages.PublicListing />} />
        <Route path="/terms" element={<Pages.Terms />} />
        <Route path="/privacy-policy" element={<Pages.PrivacyPolicy />} />
        <Route path="/about" element={<Pages.AboutPage />} />
        <Route path="/help" element={<Pages.PrelimHelp />} />
        <Route path="/kyc" element={<Pages.ProtectedRoute><Pages.KycFlow /></Pages.ProtectedRoute>} />
        <Route path="/kyc-completed" element={<Pages.ProtectedRoute><Pages.KycCompleted /></Pages.ProtectedRoute>} />
        <Route path="/waitlist" element={<Pages.Waitlist />} />
        <Route path="/onboarding" element={<Pages.ProtectedRoute><Pages.Onboarding /></Pages.ProtectedRoute>} />
        <Route path="*" element={<Pages.NoMatch />} />
      </Routes>
    </AuthProvider>
    </>
  );
}

export default App;
