import React from 'react';
import { Routes, Route } from 'react-router-dom'
import AuthProvider from './context/AuthProvider'
// Import *everything* from your new exports.js file
import * as Pages from './exports';

// Now you can use Pages.Account, Pages.Login, etc.
function App() {
  return (
    <>
    {/*<Pages.ClickButton text="Hello" onClick={() => alert('Clicked!')} /> */}
    <AuthProvider>
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
        </Route>
        <Route path="/bookmarks" element={<Pages.ProtectedRoute><Pages.Bookmarks /></Pages.ProtectedRoute>} />
        <Route path="/confirm-order" element={<Pages.ProtectedRoute><Pages.ConfirmOrder /></Pages.ProtectedRoute>} />
        <Route path="/create" element={<Pages.ProtectedRoute><Pages.Create /></Pages.ProtectedRoute>} >
          <Route index element={<Pages.ProtectedRoute><Pages.CreateRequest /></Pages.ProtectedRoute>} />
          <Route path="create-list" element={<Pages.ProtectedRoute><Pages.CreateList /></Pages.ProtectedRoute>} />
          <Route path="post-a-request" element={<Pages.ProtectedRoute><Pages.CreateRequest /></Pages.ProtectedRoute>} />
        </Route>
        <Route path="/email-auth" element={<Pages.EmailAuth />} />
        <Route path="/followers" element={<Pages.ProtectedRoute><Pages.Followers /></Pages.ProtectedRoute>} />
        <Route path="/following" element={<Pages.ProtectedRoute><Pages.Following /></Pages.ProtectedRoute>} />
        {/* <Route path="/logout" element={<Pages.Logout />} /> */}
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
        <Route path="/terms" element={<Pages.Terms />} />
        <Route path="/privacy-policy" element={<Pages.PrivacyPolicy />} />
        <Route path="/about" element={<Pages.AboutPage />} />
        <Route path="/help" element={<Pages.PrelimHelp />} />
        <Route path="/kyc" element={<Pages.ProtectedRoute><Pages.KycFlow /></Pages.ProtectedRoute>} />
        <Route path="/kyc-completed" element={<Pages.ProtectedRoute><Pages.KycCompleted /></Pages.ProtectedRoute>} />
        <Route path="/waitlist" element={<Pages.Waitlist />} />
        <Route path="/onboarding" element={<Pages.Onboarding />} />
        <Route path="*" element={<Pages.NoMatch />} />
      </Routes>
    </AuthProvider>
    </>
  );
}

export default App;
