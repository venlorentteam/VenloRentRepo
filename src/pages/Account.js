import React,{ useState, useEffect } from 'react'
import { Outlet, useNavigate, useParams, useLocation } from 'react-router-dom';
import { PageSetup, Header, SettingsMenu, SettingsDetails } from '../exports'
import { FaRegBell } from 'react-icons/fa'
import "../assets/css/global.css";
import "./Account.css";

function Account(){
  const [isMobile, setIsMobile] = useState(window.innerWidth < 700);

  const navigate = useNavigate();
  const { settingId } = useParams();
  const location = useLocation();

  const isIndexRoute = location.pathname === '/account';

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 700;
      setIsMobile(mobile);
      
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
        pageTitle= {<h2>Account and settings</h2>}
      />
      <div className="main-content">
        <div className="content">
          {/* Desktop: Show both menu and details side by side */}
          {!isMobile ? (
            <div className="settings-cont"> {/* Keep flex container */}
              <SettingsMenu /> {/* Left side */}
              <div className="settings-details"> {/* Right side */}
                <Outlet />
              </div>
            </div>
          ) : (
            /* Mobile: Show only the current route */
            <div className="settings-cont-mobile"> {/* Different class for mobile */}
              <Outlet />
            </div>
          )}
        </div>
      </div>
    </PageSetup>
  )
}

export default Account