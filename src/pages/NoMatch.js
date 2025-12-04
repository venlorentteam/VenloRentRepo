import React from 'react'
import { useNavigate } from 'react-router-dom';
import "../assets/css/global.css"
import { PrelimFooter, ClickButton } from '../exports'
import { LuHousePlug } from "react-icons/lu"
import "./NoMatch.css";

function NoMatch() {
  const navigate = useNavigate();
  return (
    <>
      <div className="nomatch-cont">
        <div className="nomatch">
          {/* <PrelimHeader pageTitle="Create an account" /> */}
          <LuHousePlug className='nomatch-icon'/>
          <h2 className='title'>Nothing to see here</h2>
          <p className='text'>Looks like the page you’re searching for has been rented out, sold, or maybe it was never built.
          <br/>Let's get you back to familiar streets.</p>
          <ClickButton 
            text="Take me home"
            onClick={() => navigate('/dashboard')}
            />
        </div>
        <PrelimFooter />
      </div>
    </>
  )
}

export default NoMatch
