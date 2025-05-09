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
    <>
      <h3 className="text-lg font-semibold mb-4 text-purple-600">All Tests</h3>

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
        <p className="text-gray-500">No tests found.</p>
      )}
    </>
  );
};

export default TestList;