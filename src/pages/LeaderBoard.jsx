import React, { useEffect, useState } from "react";
import axios from "axios";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://lumiprep10-production-e6da.up.railway.app/tests/leaderboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const sorted = res.data.leaderboard.sort((a, b) => b.accuracy - a.accuracy);
        setLeaderboard(sorted.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch leaderboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) return <div className="text-center text-gray-500">Loading leaderboard...</div>;

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto">
      <h2 className="text-lg font-semibold text-center text-gray-800 mb-4">Top Performers</h2>
      <div className="space-y-6">
        {leaderboard.map((user, index) => (
          <div key={user.userId} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={`https://i.pravatar.cc/40?u=${user.userId}`}
                alt={user.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <div className="text-sm font-medium text-gray-800">{user.name}</div>
                <div className="text-xs text-gray-600">{user.lumiId}</div>
                <div className="text-xs text-gray-500">Avg: {user.accuracy.toFixed(2)}%</div>
              </div>
            </div>
            <div className="text-2xl">{medals[index] || `#${index + 1}`}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
