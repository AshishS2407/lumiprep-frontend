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
        setLeaderboard(sorted.slice(0,3));
      } catch (error) {
        console.error("Failed to fetch leaderboard", error);
        
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) return <div>Loading leaderboard...</div>;

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="bg-gray-100 p-4 rounded-xl shadow-md space-y-6 w-80 mx-auto md:w-[400px] md:ml-0">
      {leaderboard.map((user, index) => (
        <div key={user.userId} className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={`https://i.pravatar.cc/40?u=${user.userId}`}
              alt={user.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <div className="text-sm font-medium text-gray-700">{user.name}</div>
              <div className="text-sm font-medium text-gray-700">{user.lumiId}</div>
              <div className="text-xs text-gray-500">Avg: {user.accuracy.toFixed(2)}%</div>
              </div>
          </div>
          <div className="text-xl">
            {medals[index] || `#${index + 1}`}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Leaderboard;
