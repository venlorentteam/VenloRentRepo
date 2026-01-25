import React, { useState, useEffect } from 'react'
import { Outlet, useNavigate, useParams, useLocation } from 'react-router-dom';
import { PageSetup, Header, SettingsMenu } from '../exports'
import { FaRegBell } from 'react-icons/fa'
import { RiMessageLine } from 'react-icons/ri'
import "../assets/css/global.css";
import "./Account.css";

function Account() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const location = useLocation();
  const isIndexRoute = location.pathname === '/account';

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // On desktop, if user is on /account, redirect to /account/profile
      if (!mobile && isIndexRoute) {
        navigate('/account/profile', { replace: true });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [isIndexRoute, navigate]);

  return (
    <PageSetup>
      <Header 
        backIcon={isMobile && !isIndexRoute}
        pageTitle={<h2>Account & Settings</h2>}
        icons={[
          { link: "/inbox", element: <RiMessageLine /> },
          { link: "/notifications", element: <FaRegBell /> }
        ]}
      />
      
      <div className="main-content">
        <div className="content">
          {!isMobile ? (
            /* Desktop: Side-by-side layout */
            <div className="settings-container">
              <SettingsMenu />
              <div className="settings-details-wrapper">
                <Outlet />
              </div>
            </div>
          ) : (
            /* Mobile: Show menu or details based on route */
            <div className="settings-container-mobile">
              {isIndexRoute ? (
                <SettingsMenu />
              ) : (
                <Outlet />
              )}
            </div>
          )}
        </div>
      </div>
    </PageSetup>
  )
}

export default Account