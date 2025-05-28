import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SidebarLayout from "../components/SideBarLayout";

const MockTestResult = () => {
  const { mockTestId } = useParams();
  const [evaluation, setEvaluation] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [sortType, setSortType] = useState("default"); // "default", "correct", "incorrect"
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvaluation = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to view your results.");
        return;
      }

      try {
        const [evalRes, quesRes] = await Promise.all([
          axios.get(`http://localhost:3000/mock/${mockTestId}/evaluate`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:3000/mock/question/${mockTestId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const evalData = evalRes.data;
        const questions = quesRes.data.questions || [];

        // Create category map
        const categoryData = {};
        for (let question of questions) {
          const cat = question.subTestCategory || "Uncategorized";
          const detail = evalData.details.find((d) => d.questionId === question._id);
          if (!detail) continue;

          if (!categoryData[cat]) {
            categoryData[cat] = [];
          }

          categoryData[cat].push({
            ...question,
            evaluationDetail: detail,
          });
        }

        setEvaluation(evalData);
        setQuestions(questions);
        setCategoryMap(categoryData);
      } catch (err) {
        setError("Failed to fetch results.");
        console.error(err);
      }
    };

    fetchEvaluation();
  }, [mockTestId]);

  const getFilteredQuestions = () => {
    let filtered = questions;

    // Apply category filter if selected
    if (selectedCategory && categoryMap[selectedCategory]) {
      filtered = categoryMap[selectedCategory];
    }

    // Apply correctness filter
    filtered = filtered.filter((q) => {
      const detail = evaluation.details.find(d => d.questionId === q._id);
      if (!detail) return false;
      
      if (filterType === "correct") return detail.selectedOptionIndex === detail.correctOptionIndex;
      if (filterType === "incorrect") return detail.selectedOptionIndex !== detail.correctOptionIndex;
      return true;
    });

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      const detailA = evaluation.details.find(d => d.questionId === a._id);
      const detailB = evaluation.details.find(d => d.questionId === b._id);
      
      if (sortType === "correct") {
        const aCorrect = detailA?.selectedOptionIndex === detailA?.correctOptionIndex;
        const bCorrect = detailB?.selectedOptionIndex === detailB?.correctOptionIndex;
        return bCorrect - aCorrect; // Correct answers first
      }
      else if (sortType === "incorrect") {
        const aCorrect = detailA?.selectedOptionIndex === detailA?.correctOptionIndex;
        const bCorrect = detailB?.selectedOptionIndex === detailB?.correctOptionIndex;
        return aCorrect - bCorrect; // Incorrect answers first
      }
      return 0; // Default order
    });

    return filtered.map(q => ({
      ...q,
      evaluationDetail: evaluation.details.find(d => d.questionId === q._id)
    }));
  };

  const getCategorySummary = () => {
    return Object.keys(categoryMap).map((cat) => {
      const items = categoryMap[cat];
      const correct = items.filter(
        (q) => q.evaluationDetail.selectedOptionIndex === q.evaluationDetail.correctOptionIndex
      ).length;
      const total = items.length;
      return { cat, correct, incorrect: total - correct };
    });
  };

  const shownQuestions = getFilteredQuestions();

  return (
    <SidebarLayout>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-purple-600">Mock Test Result</h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {evaluation && (
          <>
            {/* Score Box */}
            <div className="mb-6 p-4 bg-green-50 border border-green-300 rounded">
              <h3 className="text-xl font-semibold mb-2">Your Score</h3>
              <p>
                Correct Answers: <strong>{evaluation.correctAnswers}</strong> / {evaluation.totalQuestions}
              </p>
              <p>
                Score: <strong>{Math.round((evaluation.correctAnswers / evaluation.totalQuestions) * 100)}%</strong>
              </p>
            </div>

           {/* Category Stats */}
{Object.keys(categoryMap).length > 0 && (
  <div className="mb-6 p-4 bg-blue-50 border border-blue-300 rounded">
    <h3 className="text-lg font-semibold mb-2 text-blue-700">Category Breakdown</h3>
    <ul className="space-y-3">
      {getCategorySummary().map(({ cat, correct, incorrect }) => {
        const total = correct + incorrect;
        const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
        
        return (
          <li key={cat} className="flex flex-col">
            <div className="flex justify-between items-center mb-1">
              <strong className="text-gray-800">{cat}</strong>
              <span className="text-sm text-gray-600">
                {correct}/{total} ({percentage}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className="text-green-600">✅ {correct}</span>
              <span className="text-red-600">❌ {incorrect}</span>
            </div>
          </li>
        );
      })}
    </ul>
  </div>
)}

            {/* Category Selector */}
            {Object.keys(categoryMap).length > 0 && (
              <div className="mb-6">
                <label className="block mb-2 font-medium">Filter by Category:</label>
                <select
                  onChange={(e) => {
                    setSelectedCategory(e.target.value === "" ? null : e.target.value);
                    setFilterType("all");
                  }}
                  value={selectedCategory || ""}
                  className="p-2 border rounded w-full"
                >
                  <option value="">-- All Categories --</option>
                  {Object.keys(categoryMap).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Filter and Sort Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Filter Buttons */}
              <div>
                <label className="block mb-2 font-medium">Filter by Correctness:</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilterType("all")}
                    className={`${filterType === "all" ? "bg-purple-600" : "bg-gray-500"} hover:bg-purple-700 text-white px-4 py-2 rounded`}
                  >
                    All Questions
                  </button>
                  <button
                    onClick={() => setFilterType("correct")}
                    className={`${filterType === "correct" ? "bg-green-600" : "bg-gray-500"} hover:bg-green-700 text-white px-4 py-2 rounded`}
                  >
                    Correct Only
                  </button>
                  <button
                    onClick={() => setFilterType("incorrect")}
                    className={`${filterType === "incorrect" ? "bg-red-600" : "bg-gray-500"} hover:bg-red-700 text-white px-4 py-2 rounded`}
                  >
                    Incorrect Only
                  </button>
                </div>
              </div>

              {/* Sort Buttons */}
              <div>
                <label className="block mb-2 font-medium">Sort Questions:</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSortType("default")}
                    className={`${sortType === "default" ? "bg-purple-600" : "bg-gray-500"} hover:bg-purple-700 text-white px-4 py-2 rounded`}
                  >
                    Default Order
                  </button>
                  <button
                    onClick={() => setSortType("correct")}
                    className={`${sortType === "correct" ? "bg-green-600" : "bg-gray-500"} hover:bg-green-700 text-white px-4 py-2 rounded`}
                  >
                    Correct First
                  </button>
                  <button
                    onClick={() => setSortType("incorrect")}
                    className={`${sortType === "incorrect" ? "bg-red-600" : "bg-gray-500"} hover:bg-red-700 text-white px-4 py-2 rounded`}
                  >
                    Incorrect First
                  </button>
                </div>
              </div>
            </div>

            {/* Question Count */}
            <div className="mb-4 text-gray-600">
              Showing {shownQuestions.length} of {questions.length} questions
            </div>

            {/* Question Details */}
            <div className="space-y-6">
              {shownQuestions.map((question, idx) => {
                const detail = question.evaluationDetail;
                if (!detail) return null;

                return (
                  <div key={question._id} className="p-4 border rounded shadow bg-gray-50">
                    <p className="font-semibold mb-2">
                      {idx + 1}. {question.questionText}{" "}
                      <span className="text-sm text-gray-500">({question.subTestCategory || "Uncategorized"})</span>
                    </p>
                    <div className="space-y-2">
                      {question.options.map((option, i) => {
                        const isSelected = i === detail.selectedOptionIndex;
                        const isCorrect = i === detail.correctOptionIndex;

                        const bgColor = isCorrect
                          ? "bg-green-100 border-green-600"
                          : isSelected && !isCorrect
                          ? "bg-red-100 border-red-600"
                          : "bg-white";

                        return (
                          <div key={option._id} className={`p-2 border rounded ${bgColor}`}>
                            <span className="font-medium">{option.text}</span>
                            {isSelected && (
                              <span className="ml-2 text-sm text-blue-700">(Your Answer)</span>
                            )}
                            {isCorrect && (
                              <span className="ml-2 text-sm text-green-700 font-bold">
                                (Correct Answer)
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {question.explanation && (
                      <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                        <p className="text-sm text-gray-700">
                          <strong>Explanation:</strong> {question.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </SidebarLayout>
  );
};

export default MockTestResult;