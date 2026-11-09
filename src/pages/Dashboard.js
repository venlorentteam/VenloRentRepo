import { useAuth } from "../context/AuthProvider"
import DashboardAgent from './DashboardAgent'
import DashboardRenter from './DashboardRenter'
import '../assets/css/global.css'
import './Dashboard.css'

function Dashboard() {
  const { user } = useAuth()
  const isAgentAccount = user?.role === 'agent'
  return isAgentAccount ? <DashboardAgent /> : <DashboardRenter />
}

export default Dashboard
