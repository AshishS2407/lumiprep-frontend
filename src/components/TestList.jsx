import React, { useEffect, useState } from "react";
import axios from "axios";
import TestCard from "./TestCard";
import { useNavigate } from "react-router-dom";
import SimpleTestCard from "./SimpleTestCard";

const TestList = () => {
  const [tests, setTests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://lumiprep10-production-e6da.up.railway.app/tests/main-tests", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: false,
        });
        setTests(res.data);
      } catch (error) {
        console.error("Error fetching tests", error);
      }
    };

    fetchTests();
  }, []);

  const handleTestClick = (testId) => {
    navigate(`/tests/${testId}/subtests`);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
      <h3 className="text-lg sm:text-xl font-semibold mb-6 text-purple-600 text-center sm:text-left">
        All Tests
      </h3>

      {tests.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <SimpleTestCard
              key={test._id}
              test={test}
              onClick={() => handleTestClick(test._id)}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center sm:text-left">No tests found.</p>
      )}
    </div>
  );
};

export default TestList;
