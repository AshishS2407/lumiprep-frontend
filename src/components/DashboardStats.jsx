import React, { useEffect, useState } from "react";
import axios from "axios";

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalTests: 0,
    passed: 0,
    failed: 0,
    average: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No token found. Please log in.");
          return;
        }

        const res = await axios.get(
          `https://lumiprep10-production-e6da.up.railway.app/tests/user-stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            withCredentials: false, // Optional if not using cookies
          }
        );

        setStats({
          totalTests: res.data.totalTests ?? 0,
          passed: res.data.passed ?? 0,
          failed: res.data.failed ?? 0,
          average:
            typeof res.data.average === "number" && res.data.average >= 0
              ? res.data.average
              : 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-rows-4 w-96 md:w-96 mx-auto sm:grid-cols-2 md:grid-cols-2 gap-4">
      <div className="bg-gray-100 p-6 rounded-xl shadow-md text-center">
        <p className="text-2xl font-bold text-[#a14bf4]">{stats.totalTests}</p>
        <p className="text-gray-600 text-sm">Tests Written</p>
      </div>
      <div className="bg-gray-100 p-6 rounded-xl shadow-md text-center">
        <p className="text-2xl font-bold text-green-500">{stats.passed}</p>
        <p className="text-gray-600 text-sm">Passed</p>
      </div>
      <div className="bg-gray-100 p-6 rounded-xl shadow-md text-center">
        <p className="text-2xl font-bold text-red-500">{stats.failed}</p>
        <p className="text-gray-600 text-sm">Failed</p>
      </div>
      <div className="bg-gray-100 p-6 rounded-xl shadow-md text-center">
        <p className="text-2xl font-bold text-purple-500">
          {typeof stats.average === "number" && stats.average >= 0
            ? stats.average.toFixed(2) + "%"
            : "N/A"}
        </p>
        <p className="text-gray-600 text-sm">Overall Average</p>
      </div>
    </div>
  );
};

export default DashboardStats;
