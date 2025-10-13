import react, { Routes, Route } from 'react-router-dom'
//Import all elements
import { Orders } from './pages/Orders'
import { Account } from './pages/Account'
import { ActiveOrders } from './pages/ActiveOrders'
import { AllOrders } from './pages/AllOrders'
import { Bookmarks } from './pages/Bookmarks'
import { ConfirmOrder } from './pages/ConfirmOrder'
import { Create } from './pages/Create'
import { CreateList } from './pages/CreateList'
import { CreatePost } from './pages/CreatePost'
import { Dashboard } from './pages/Dashboard'
import { EmailAuth } from './pages/EmailAuth' //Not sure of the relevance of this page since the signup page can display both with a conditional
import { Followers } from './pages/Followers'
import { Following } from './pages/Following'
import { Login } from './pages/Login'
import { Logout } from './pages/Logout'
import { Messages } from './pages/Messages'
import { NoMatch } from './pages/NoMatch' //For invalid FE routes (404)
import { Notifications } from './pages/Notifications'
import { PasswordRecovery } from './pages/PasswordRecovery'
import { PasswordReset } from './pages/PasswordReset'
import { Profile } from './pages/Profile'
import { Register } from './pages/Register'
import { Search } from './pages/Search'
import { User } from './pages/User'
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/account" element={<Account />} />
        <Route path="/orders" element={<Orders />} >
          <Route index element={<ActiveOrders />} />
          <Route path="all-orders" element={<AllOrders />} />
          <Route path="active-orders" element={<ActiveOrders />} />
        </Route>
        <Route path="/confirm-order" element={<ConfirmOrder />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/create" element={<Create />} >
          <Route index element={<CreatePost />} />
          <Route path="create-list" element={<CreateList />} />
          <Route path="create-post" element={<CreatePost />} />
        </Route>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/email-auth" element={<EmailAuth />} />
        <Route path="/followers" element={<Followers />} />
        <Route path="/following" element={<Following />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="*" element={<NoMatch />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/recover-password" element={<PasswordRecovery />} />
        <Route path="/reset-password" element={<PasswordReset />} />
        <Route path="/profile" element={<Bookmarks />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<Search />} />
        <Route path="/user" element={<User />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;
