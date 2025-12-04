import React from "react";
import { BsGearWide } from "react-icons/bs";
import * as Components from "../exports"
const Profile = () => {
  const statsData = [
    { label: "Completed Orders", value: 66 },
    { label: "Good Rating", value: "80%" },
    { label: "All Completed Orders", value: 475 },
    { label: "Completion Rate", value: "90%" },
  ];

  return (
    <Components.PageSetup>
      <Components.Header //Top page header
        backIcon={true}
        pageTitle= {<h2>My Profile</h2>} 
        menuIcon={{element: <BsGearWide />, link: "/account"}}
      />
      <div className="main-content">
        <div className="content">
          {/*To contain property and post cards*/}
          {/* <Components.SearchBar placeholder="Search messages.."/> */}
          <Components.AccountInfoCard/>
          <Components.ListStats stats={statsData}/>
        </div>
      </div>
    </Components.PageSetup>
  );
};

export default Profile;
