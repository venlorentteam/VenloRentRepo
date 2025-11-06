import React from "react";
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
      <Components.SideNav />{/*Desktop left-side navigation*/}
      <Components.Header //Top page header
        pageTitle= {<h2>My Profile</h2>}
        // icons={
        //   [
        //     {link: "/inbox", element: < RiMessageLine />},
        //     {link: "/notifications", element: < FaRegBell />}
        //   ]
        // }
        //button={<ClickButton text="Hello" onClick={() => alert('Clicked!')} />} 
      />
      <div className="content">
        {/*To contain property and post cards*/}
        <Components.SearchBar placeholder="Search messages.."/>
        <Components.AccountInfoCard/>
        <Components.ListStats stats= {statsData}/>
      </div>
      <div className="sidebar">
        {/*Optional for follows and all*/}
      </div>
      <Components.IconNav />{/*Mobile bottom navigation*/}
    </Components.PageSetup>
  );
};

export default Profile;
