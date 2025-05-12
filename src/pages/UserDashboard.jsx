import React from "react";
import SidebarLayout from "../components/SideBarLayout";
import RecentTests from "../components/RecentTests";
import DashboardStats from "../components/DashboardStats";
import Leaderboard from "./LeaderBoard";

const UserDashboard = () => {
  return (
    <SidebarLayout>
      <div className="w-full max-w-screen-xl mx-auto space-y-10 px-4 sm:px-6 lg:px-8 py-6">
        {/* Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RecentTests />
          <div className="w-full">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 text-center md:text-left">
              Upcoming Quiz Competition
            </h3>
            <div className="bg-gray-100 p-6 rounded-xl shadow-md text-center w-full max-w-xs mx-auto md:mt-10">
              <div className="text-4xl sm:text-5xl mb-2 text-[#a14bf4]">12</div>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">12th Aug, 2023</p>
              <button className="bg-[#a14bf4] hover:bg-[#8e3ef3] text-white py-2 px-4 rounded-full text-sm sm:text-base">
                Register Now
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="w-full">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 text-center md:text-left">
              Leader Board
            </h3>
            <Leaderboard />
          </div>
          <div>
            <DashboardStats />
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default UserDashboard;
