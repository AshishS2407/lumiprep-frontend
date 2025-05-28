import React, { useEffect, useState } from "react";
import axios from "axios";
import MockTestCard from "../components/MockTestCard";
import SidebarLayout from "../components/SideBarLayout";
import { useNavigate } from "react-router-dom"; // ⬅️ Import useNavigate

const AllMockTests = () => {
  const [mockTests, setMockTests] = useState([]);
  const navigate = useNavigate(); // ⬅️ Initialize navigate

  useEffect(() => {
    const fetchMockTests = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/mock/get-mocks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data) {
          setMockTests(res.data);
        }
      } catch (err) {
        console.error("Error fetching mock tests:", err);
      }
    };

    fetchMockTests();
  }, []);

  const handleTestClick = (testId) => {
    navigate(`/mock-test/${testId}`); // ⬅️ Navigate to mock test questions page
  };

  return (
    <SidebarLayout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-purple-600">All Mock Tests</h2>
        </div>

        {mockTests.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTests.map((test) => (
              <MockTestCard
                key={test._id}
                test={test}
                onClick={() => handleTestClick(test._id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No mock tests found.</p>
        )}
      </div>
    </SidebarLayout>
  );
};

export default AllMockTests;
