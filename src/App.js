import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import *everything* from your new exports.js file
import * as Pages from './exports';

// Now you can use Pages.Account, Pages.Login, etc.
function App() {
 
  return (
    <>
    <Pages.ClickButton text="Hello" onClick={() => alert('Clicked!')} />
    <Routes>
      <Route path="/login" element={<Pages.Login />} />
      <Route path="/register" element={<Pages.Register />} />
      <Route path="/dashboard" element={<Pages.Dashboard />} />
      <Route path="/orders" element={<Pages.Orders />} />
      <Route path="/account" element={<Pages.Account />} />
      <Route path="/active-orders" element={<Pages.ActiveOrders />} />
      <Route path="/all-orders" element={<Pages.AllOrders />} />
      <Route path="/bookmarks" element={<Pages.Bookmarks />} />
      <Route path="/confirm-order" element={<Pages.ConfirmOrder />} />
      <Route path="/create" element={<Pages.Create />} />
      <Route path="/create-list" element={<Pages.CreateList />} />
      <Route path="/create-post" element={<Pages.CreatePost />} />
      <Route path="/email-auth" element={<Pages.EmailAuth />} />
      <Route path="/followers" element={<Pages.Followers />} />
      <Route path="/following" element={<Pages.Following />} />
      <Route path="/logout" element={<Pages.Logout />} />
      <Route path="/messages" element={<Pages.Messages />} />
      <Route path="/notifications" element={<Pages.Notifications />} />
      <Route path="/password-recovery" element={<Pages.PasswordRecovery />} />
      <Route path="/password-reset" element={<Pages.PasswordReset />} />
      <Route path="/profile" element={<Pages.Profile />} />
      <Route path="/search" element={<Pages.Search />} />
      <Route path="/user" element={<Pages.User />} />
      <Route path="*" element={<Pages.NoMatch />} />
    </Routes>
      </>
  );
}

export default App;
