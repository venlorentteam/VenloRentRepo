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
    <div>
           <Components.AccountInfoCard/>
           <Components.ListStats stats= {statsData}/>
    </div>
  );
};

export default Profile;
