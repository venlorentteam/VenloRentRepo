import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FiUser, FiUserCheck, FiUserPlus, FiUsers, FiHelpCircle } from 'react-icons/fi'
import { MdBlockFlipped } from "react-icons/md";
import { LiaAngleRightSolid } from "react-icons/lia"
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import { RiMegaphoneLine } from "react-icons/ri";
import { LiaLanguageSolid } from "react-icons/lia";
import { MdOutlineWorkspacePremium, MdLockOutline } from 'react-icons/md'
// import { MdLockOutline } from "react-icons/md";
import { NavLink } from 'react-router-dom'
const SettingsMenu = () => {
  //const { settingId } = useParams() // Get current setting from URL

  const settingsMenu = [
    { id: 'profile', label: 'Account', icon: FiUser },
    { id: 'upgrade', label: 'Upgrade', icon: MdOutlineWorkspacePremium },
    { id: 'kyc', label: 'Identity Verification', icon: FiUserCheck },
    { id: 'follow', label: 'Follow and Invite Friends', icon: FiUserPlus },
    { id: 'friends', label: 'Friend Requests', icon: FiUsers },
    { id: 'language', label: 'Language & Region', icon: LiaLanguageSolid },
    { id: 'ads', label: 'Ads', icon: RiMegaphoneLine },
    { id: 'blocked', label: 'Blocked', icon: MdBlockFlipped },
    { id: 'security', label: 'Security and Privacy', icon: MdLockOutline },
    { id: 'help', label: 'Help Centre', icon: FiHelpCircle },
    { id: 'terms', label: 'Terms and Policies', icon: HiOutlineExclamationCircle },
  ]
  //  const handleSettingClick = (id) => {
  //   // Navigate to /account/:id
  //   navigate(`/account/${id}`)
  // }
  return (
    <div className="settings-list">
      {settingsMenu.map((setting) => {
        const Icon = setting.icon
        // // Check if this setting is currently selected
        // const isSelected = settingId === setting.id

        return(
          <NavLink key={setting.id} 
            to={`/account/${setting.id}`}
          >
            <span className="left-side">
              <Icon className="left-icon"/>
              {setting.label}
            </span>
            <LiaAngleRightSolid className="right-icon"/>
          </NavLink>
        )
      })}
    </div>
  )

}

export default SettingsMenu