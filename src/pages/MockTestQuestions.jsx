import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import SidebarLayout from "../components/SideBarLayout";
import MockTestQuestionCard from "../components/MockTestQuestionCard";

const MockTestQuestions = () => {
  const { mockTestId } = useParams();
  const navigate = useNavigate(); // ✅ useNavigate for redirecting
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found. Please login.");
        return;
      }

      try {
        const res = await axios.get(`http://localhost:3000/mock/question/${mockTestId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuestions(res.data.questions || []);
        setError(null);
      } catch (err) {
        if (err.response?.status === 403) {
          setError("Access denied. Please login or check your permissions.");
        } else {
          setError("Failed to fetch questions.");
          console.error("Error fetching questions:", err);
        }
      }
    };

    fetchQuestions();
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
    if (!token) {
      setError("Authentication token not found. Please login.");
      setSubmitting(false);
      return;
    }

    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, selectedOptionIndex]) => ({
        questionId,
        selectedOptionIndex,
      }));

      await axios.post(
        `http://localhost:3000/mock/${mockTestId}/submit-answers`,
        { answers: formattedAnswers },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Redirect to result page after successful submission
      navigate(`/mock/${mockTestId}/result`);
    } catch (err) {
      if (err.response?.status === 400) {
        setError(err.response.data.message || "Submission error.");
      } else {
        setError("Failed to submit answers.");
        console.error("Error submitting answers:", err);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SidebarLayout>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-purple-600">Mock Test Questions</h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {!error && questions.length === 0 && <p>No questions available for this test.</p>}

        {!error && questions.length > 0 && (
          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
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
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className={`${submitting ? "opacity-50 cursor-not-allowed" : "hover:bg-purple-700"
                } bg-purple-600 text-white font-semibold px-6 py-2 rounded`}
            >
              {submitting ? "Submitting..." : "Submit Answers"}
            </button>
          </form>
        )}
      </div>
    </SidebarLayout>
  );
};

export default MockTestQuestions;
