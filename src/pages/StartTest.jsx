import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import QuizSidebar from "../components/QuizSidebar";
import QuestionCardSelectable from "../components/QuestionCardSelectable";

const StartTest = () => {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [test, setTest] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      try {
        const submissionRes = await axios.get(
          `https://lumiprep10-production-e6da.up.railway.app/tests/${testId}/check-submission`,
          { headers }
        );

        if (submissionRes.data.submitted) {
          setSubmitted(true);
        }

        // Always fetch test (needed even when already submitted)
        const testRes = await axios.get(
          `https://lumiprep10-production-e6da.up.railway.app/tests/${testId}`,
          { headers }
        );

        const fetchedTest = testRes.data.test || testRes.data;
        setTest(fetchedTest);

        // Only fetch questions and timer if not submitted
        if (!submissionRes.data.submitted) {
          const questionsRes = await axios.get(
            `https://lumiprep10-production-e6da.up.railway.app/tests/${testId}/questions`,
            { headers }
          );
          setQuestions(questionsRes.data.questions || questionsRes.data);

          const duration = fetchedTest.duration || 30;
          setTimer(duration * 60);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [testId]);

  // Timer countdown
  useEffect(() => {
    if (submitted || timer === null) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, submitted]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSelect = (questionId, index) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: index,
    }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    const answers = Object.entries(selectedAnswers).map(([questionId, selectedOptionIndex]) => ({
      questionId,
      selectedOptionIndex,
    }));

    try {
      await axios.post(
        `https://lumiprep10-production-e6da.up.railway.app/tests/${testId}/submit-answers`,
        { testId, answers },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      navigate(`/test/${testId}/submitted`);
    } catch (error) {
      console.error("Error submitting answers:", error.response?.data || error.message);
    }
  };

  // Handle submitted test with loading fallback
  if (submitted) {
    if (!test) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-gray-500 text-lg">Loading test info...</p>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{test.testTitle}</h1>
          <p className="text-lg text-gray-600 mb-6">By <strong>{test.companyName}</strong></p>
          <p className="text-xl font-semibold text-gray-700 mb-6">Test Already Submitted</p>
          <button
            onClick={() => navigate(`/test/${testId}/submitted`)}
            className="bg-purple-600 text-white font-medium py-2 px-6 rounded-full shadow-md hover:bg-purple-700 transition"
          >
            View Result
          </button>
        </div>
      </div>
    );
  }

  // Loading State
  if (!test || timer === null) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600 text-lg">Loading test...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-[#f7f8fc] via-[#e3e6f3] to-[#fdf2f8] p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{test.testTitle}</h1>
          <p className="text-gray-500 text-sm text-center sm:text-left">
            {test.companyName}
          </p>
        </div>
        <div className="flex items-center gap-2 text-lg font-semibold bg-white text-gray-800 border border-gray-300 px-5 py-2 rounded-full shadow-md">
          ⏱ <span className="font-mono">{formatTime(timer)}</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex flex-col md:flex-row bg-white rounded-3xl shadow-xl overflow-hidden max-w-6xl mx-auto border border-gray-100">
        {/* Sidebar */}
        <aside className="hidden md:block md:w-1/5 bg-gray-900 text-white p-6">
          <QuizSidebar />
        </aside>

        {/* Questions */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-center text-purple-800 mb-8">
            {test.companyName} Quiz Competition
          </h2>

          <div className="space-y-8">
            {questions.map((q, idx) => (
              <QuestionCardSelectable
                key={q._id}
                question={q}
                index={idx}
                selectedAnswer={selectedAnswers[q._id]}
                onSelect={handleSelect}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white text-lg font-medium px-10 py-3 rounded-full shadow-md transition duration-200"
            >
              Submit Answers
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StartTest;
