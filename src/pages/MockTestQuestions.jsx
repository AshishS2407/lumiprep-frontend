import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import SidebarLayout from "../components/SideBarLayout";
import MockTestQuestionCard from "../components/MockTestQuestionCard";

const MockTestQuestions = () => {
  const { mockTestId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [test, setTest] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found. Please login.");
        return;
      }

      try {
        const submissionRes = await axios.get(
          `https://lumiprep10-production-e6da.up.railway.app/mock/${mockTestId}/is-submitted`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (submissionRes.data.submitted) {
          setAlreadySubmitted(true);
          return;
        }

        const questionRes = await axios.get(
          `https://lumiprep10-production-e6da.up.railway.app/mock/question/${mockTestId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setQuestions(questionRes.data.questions || []);

        const testRes = await axios.get(
        `https://lumiprep10-production-e6da.up.railway.app/mock/test/${mockTestId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTest(testRes.data.test || null);        
      setError(null);
      } catch (err) {
        if (err.response?.status === 403) {
          setError("Access denied. Please login or check your permissions.");
        } else {
          setError("Failed to load mock test data.");
          console.error(err);
        }
      }
    };

    fetchData();
  }, [mockTestId]);

  const handleOptionChange = (questionId, selectedIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedIndex,
    }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== questions.length) {
      setError("Please answer all questions before submitting.");
      return;
    }

    setSubmitting(true);
    setError(null);
    const token = localStorage.getItem("token");

    try {
      const formattedAnswers = Object.entries(answers).map(
        ([questionId, selectedOptionIndex]) => ({
          questionId,
          selectedOptionIndex,
        })
      );

      await axios.post(
        `https://lumiprep10-production-e6da.up.railway.app/mock/${mockTestId}/submit-answers`,
        { answers: formattedAnswers },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAlreadySubmitted(true);
      navigate(`/mock/${mockTestId}/result`);
    } catch (err) {
      setError("Failed to submit answers.");
      console.error("Error submitting answers:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (alreadySubmitted ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2"> Test Already Submitted</h1>
          {/* <h1 className="text-lg text-gray-600 mb-6">Test Already Submitted</h1> */}
          <p className="text-gray-700 mb-6">
              You can view results now. 
            </p>
          <button
            onClick={() => navigate(`/mock/${mockTestId}/result`)}
            className="bg-purple-600 text-white font-medium py-2 px-6 rounded-full shadow-md hover:bg-purple-700 transition"
          >
            View Result
          </button>
        </div>
      </div>
    );
  }

  return (
    <>

      <div className="min-h-screen font-sans bg-gradient-to-br from-[#f7f8fc] via-[#e3e6f3] to-[#fdf2f8] p-4 sm:p-6">

                  <h1 className="text-2xl font-bold text-purple-600 mb-10">Mock Test Questions</h1>

        <div className="min-h-screen font-sans rounded-3xl shadow-lg overflow-hidden bg-white min-h-[80vh] max-w-6xl mx-auto p-4 sm:p-6">

          <div className="flex justify-center mb-6">
  {test?.name && (
    <p className="text-purple-800 font-bold text-lg text-center">{test.name}</p>
  )}
</div>

          {error && <p className="text-red-600 mb-4">{error}</p>}

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {questions.map((question, index) => (
              <MockTestQuestionCard
                key={question._id}
                question={question}
                index={index}
                selectedAnswer={answers[question._id]}
                onSelect={handleOptionChange}
                subTestCategory={question.subTestCategory}
              />
            ))}

            {questions.length > 0 && (
              <div className="text-center mt-6">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className={`${submitting ? "opacity-50 cursor-not-allowed" : "hover:bg-purple-700"
                    } bg-purple-600 text-white font-semibold px-8 py-2 rounded-full transition`}
                >
                  {submitting ? "Submitting..." : "Submit Answers"}
                </button>
              </div>
            )}
          </form>

          {questions.length === 0 && !error && (
            <p className="text-gray-600 text-center mt-10">No questions available for this test.</p>
          )}
        </div>

      </div>
    </>
  );
};

export default MockTestQuestions;
