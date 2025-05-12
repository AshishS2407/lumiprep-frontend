import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import QuizSidebar from "../components/QuizSidebar";
import QuestionCardSelectable from "../components/QuestionCardSelectable";

const StartTest = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const intervalRef = useRef(null);

  const [questions, setQuestions] = useState([]);
  const [test, setTest] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState(() => {
    const saved = localStorage.getItem(`answers-${testId}`);
    return saved ? JSON.parse(saved) : {};
  });

  const [timer, setTimer] = useState(null); // initially null

  // Fetch test and questions
  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const token = localStorage.getItem("token");
  
        const [testRes, questionsRes] = await Promise.all([
          axios.get(`https://lumiprep10-production-e6da.up.railway.app/tests/${testId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            withCredentials: false, // Optional unless using cookies
          }),
          axios.get(`https://lumiprep10-production-e6da.up.railway.app/tests/${testId}/questions`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            withCredentials: false,
          }),
        ]);
  
        const fetchedTest = testRes.data.test || testRes.data;
        setTest(fetchedTest);
        setQuestions(questionsRes.data.questions || questionsRes.data);
  
        // Initialize timer once test is loaded
        const savedTimer = localStorage.getItem(`timer-${testId}`);
        const initialSeconds = savedTimer
          ? parseInt(savedTimer, 10)
          : (fetchedTest.duration || 30) * 60; // default to 30 minutes if duration missing
        setTimer(initialSeconds);
      } catch (err) {
        console.error("Failed to fetch test data:", err);
      }
    };
  
    fetchTestData();
  }, [testId]);
  

  // Timer countdown
  useEffect(() => {
    if (timer === null) return; // don't start interval until timer is ready

    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [timer]);

  // Save timer
  useEffect(() => {
    if (timer !== null) {
      localStorage.setItem(`timer-${testId}`, timer);
    }
  }, [timer, testId]);

  // Save answers
  useEffect(() => {
    localStorage.setItem(`answers-${testId}`, JSON.stringify(selectedAnswers));
  }, [selectedAnswers, testId]);

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
  
    const answers = Object.entries(selectedAnswers).map(
      ([questionId, selectedOptionIndex]) => ({
        questionId,
        selectedOptionIndex,
      })
    );
  
    try {
      const response = await axios({
        method: "post",
        url: `https://lumiprep10-production-e6da.up.railway.app/tests/${testId}/submit-answers`,
        data: {
          testId,
          answers,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      console.log("Submission response:", response.data);
  
      localStorage.removeItem(`answers-${testId}`);
      localStorage.removeItem(`timer-${testId}`);
  
      navigate(`/test/${testId}/submitted`);
    } catch (err) {
      console.error("Submission failed:", err.response?.data || err.message);
    }
  };
  

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
  
        {/* Questions Section */}
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
