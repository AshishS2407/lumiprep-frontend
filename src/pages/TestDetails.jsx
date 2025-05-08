import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import SidebarLayout from "../components/SideBarLayout";
import TestInfoCard from "../components/TestInfoCard"; // Import the new component

const TestDetails = () => {
  const { testId } = useParams();
  const [test, setTest] = useState(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `https://lumiprep10-production-e6da.up.railway.app/tests/${testId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: false,
          }
        );
        setTest(res.data);
      } catch (error) {
        console.error("Error fetching test:", error);
      }
    };

    fetchTest();
  }, [testId]);

  if (!test) return <p className="p-8 text-lg">Loading test...</p>;

  return (
    <SidebarLayout>
      <TestInfoCard test={test} />
    </SidebarLayout>
  );
};

export default TestDetails;
