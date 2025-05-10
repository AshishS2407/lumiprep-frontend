import React from "react";
import SidebarLayout from "../components/SideBarLayout";
import RecentTests from "../components/RecentTests";
import DashboardStats from "../components/DashboardStats";
import Leaderboard from "./LeaderBoard";

const UserDashboard = () => {
  return (
    <SidebarLayout>
      <div className="w-full max-w-screen-xl mx-auto space-y-10">
        {/* Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RecentTests />
          <div className="w-full">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 text-center">Upcoming Quiz Competition</h3>
            <div className="bg-gray-100 p-6 rounded-xl shadow-md text-center md:w-80 md:mx-auto md:mt-20 w-80 mx-auto">
              <div className="text-5xl mb-2 text-[#a14bf4]">12</div>
              <p className="text-gray-600 mb-2">12th Aug, 2023</p>
              <button className="bg-[#a14bf4] hover:bg-[#8e3ef3] text-white py-2 px-4 rounded-full">
                Register Now
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="w-full">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 text-center md:text-left md:mt-10">Leader Board</h3>
            <Leaderboard />

          </div>
          <div className="md:mt-23">
            <DashboardStats />

          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default UserDashboard;
