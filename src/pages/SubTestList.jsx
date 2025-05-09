import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import TestCard from "../components/TestCard";
import SidebarLayout from "../components/SideBarLayout";
import { FaFilter } from "react-icons/fa";

const SubTestList = () => {
  const { mainTestId } = useParams();
  const [subTests, setSubTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubTests = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`https://lumiprep10-production-e6da.up.railway.app/tests/sub-tests/${mainTestId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data) {
          setSubTests(res.data);
          setFilteredTests(res.data); // Initialize filtered tests
        }
      } catch (err) {
        console.error("Error fetching subtests:", err);
      }
    };

    fetchSubTests();
  }, [mainTestId]);

  // Apply filter whenever filter or subTests changes
  useEffect(() => {
    const filtered = subTests.filter((test) => {
      if (filter === "all") return true;
      return test.status?.toLowerCase() === filter.toLowerCase();
    });
    setFilteredTests(filtered);
  }, [filter, subTests]);

  const handleSubTestClick = (testId) => {
    navigate(`/tests/${testId}`);
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleFilterChange = (value) => {
    setFilter(value);
    setIsDropdownOpen(false);
  };

  return (
    <SidebarLayout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-purple-600">Sub Tests</h2>
          <div className="relative">
            <button
              className="flex items-center gap-1 px-3 py-2 bg-white shadow-md rounded-lg text-sm"
              onClick={toggleDropdown}
            >
              <FaFilter />
              Sort By
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg w-40 z-50">
                <ul>
                  {["all", "submitted", "expired", "upcoming"].map((option) => (
                    <li
                      key={option}
                      className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-200 capitalize"
                      onClick={() => handleFilterChange(option)}
                    >
                      {option === "all" ? "All Tests" : option}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {filteredTests.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTests.map((test) => (
              <TestCard
                key={test._id}
                test={test}
                status={test.status}
                onClick={() => handleSubTestClick(test._id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            {filter === "all" ? "No subtests found." : `No ${filter} subtests found.`}
          </p>
        )}
      </div>
    </SidebarLayout>
  );
};

export default SubTestList;