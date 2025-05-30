import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import SidebarLayout from "../components/SideBarLayout";

const MockTestResult = () => {
  const { mockTestId } = useParams();
  const navigate = useNavigate();
  const [evaluation, setEvaluation] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [filteredQuestions, setFilteredQuestions] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvaluation = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to view your results.");
        setLoading(false);
        return;
      }

      try {
        const [evalRes, quesRes] = await Promise.all([
          axios.get(`https://lumiprep10-production-e6da.up.railway.app/mock/${mockTestId}/evaluate`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`https://lumiprep10-production-e6da.up.railway.app/mock/question/${mockTestId}`, {
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
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluation();
  }, [mockTestId]);

  const handleFilter = (type) => {
    setFilterType(type);

    let questionsToFilter = questions;
    if (selectedCategory && categoryMap[selectedCategory]) {
      questionsToFilter = categoryMap[selectedCategory];
    }

    if (type === "all") {
      setFilteredQuestions(questionsToFilter);
      return;
    }

    const filtered = questionsToFilter.filter((q) => {
      const detail = evaluation.details.find(d => d.questionId === q._id);
      if (!detail) return false;

      if (type === "correct") return detail.selectedOptionIndex === detail.correctOptionIndex;
      if (type === "incorrect") return detail.selectedOptionIndex !== detail.correctOptionIndex;
      return true;
    });

    setFilteredQuestions(filtered);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setFilterType("all");
    if (category) {
      setFilteredQuestions(categoryMap[category]);
    } else {
      setFilteredQuestions(null);
    }
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


  const getOptionStyle = (question, index) => {
    const detail = evaluation?.details.find((d) => d.questionId === question._id);
    const isSelected = detail?.selectedOptionIndex === index;
    const isCorrect = detail?.correctOptionIndex === index;

    if (isCorrect) return "bg-green-100 border-green-600";
    if (isSelected && !isCorrect) return "bg-red-100 border-red-600";
    return "bg-white border-gray-300";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600 text-lg">Loading results...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600 text-lg">{error}</div>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600 text-lg">No results found</div>
      </div>
    );
  }

  const percentage = Math.round((evaluation.correctAnswers / evaluation.totalQuestions) * 100);
  const displayQuestions = filteredQuestions || questions;

  // Get button labels based on selected category
  const getFilterButtonLabel = (type) => {
    if (!selectedCategory) {
      return type === "correct" ? "Show Correct" : "Show Incorrect";
    }
    return type === "correct"
      ? `Show ${selectedCategory} Correct`
      : `Show ${selectedCategory} Incorrect`;
  };

  return (
    <div className="min-h-screen font-sans bg-gradient-to-r from-[#e6e3f6] via-[#e8f0f9] to-[#f5eaf7] p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-xl font-semibold text-gray-800">Mock Test Results</h1>
          <p className="text-gray-500 text-sm text-center sm:text-left">Performance Review</p>
        </div>

        <div className="bg-white border border-gray-300 px-6 py-4 rounded-xl shadow-sm grid grid-cols-3 gap-4 text-center text-sm font-medium w-full sm:w-auto">
          <div>
            <p className="text-gray-500">Score</p>
            <p className="text-purple-700 font-bold text-lg">{percentage}%</p>
          </div>
          <div>
            <p className="text-gray-500">Correct</p>
            <p className="text-green-600 font-semibold text-lg">{evaluation.correctAnswers}</p>
          </div>
          <div>
            <p className="text-gray-500">Total</p>
            <p className="text-gray-800 font-semibold text-lg">{evaluation.totalQuestions}</p>
          </div>
        </div>
      </div>

{/* Simplified Category Breakdown Section */}
{Object.keys(categoryMap).length > 0 && (
  <div className="mb-6 w-full max-w-5xl mx-auto">
  <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-4 sm:p-6">

      <h3 className="text-lg font-semibold text-gray-800 mb-4">Category Performance</h3>
      
      <div className="space-y-4">
        {getCategorySummary().map(({ cat, correct, incorrect }) => {
          const total = correct + incorrect;
          const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

          return (
            <div key={cat} className="border-b border-gray-200 pb-3">
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-base font-medium text-gray-800">{cat}</h4>
                <span className="text-purple-700 font-semibold text-sm">{percentage}%</span>
              </div>

              <div className="text-sm text-gray-600 flex flex-wrap gap-x-4 mb-1">
                <span className="text-green-600">
                  <span className="text-gray-500">Correct:</span> {correct}
                </span>
                <span className="text-red-600">
                  <span className="text-gray-500">Incorrect:</span> {incorrect}
                </span>
                <span className="text-gray-500">
                  Total: {total}
                </span>
              </div>

              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
)}



      {/* Mobile Category Dropdown (hidden on desktop) */}
      <div className="md:hidden w-full mb-4">
        <label htmlFor="mobile-category-select" className="block text-sm font-medium text-gray-700 mb-1">
          Filter by Category:
        </label>
        <select
          id="mobile-category-select"
          onChange={(e) => handleCategorySelect(e.target.value || null)}
          value={selectedCategory || ""}
          className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="">All Categories</option>
          {Object.keys(categoryMap).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>


      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        <button
          onClick={() => handleFilter("correct")}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full transition"
        >
          {getFilterButtonLabel("correct")}
        </button>
        <button
          onClick={() => handleFilter("incorrect")}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full transition"
        >
          {getFilterButtonLabel("incorrect")}
        </button>
        {(filteredQuestions || selectedCategory) && (
          <button
            onClick={() => {
              handleCategorySelect(null);
              handleFilter("all");
            }}
            className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-full transition"
          >
            {selectedCategory ? `Show All ${selectedCategory} Questions` : "Show All Questions"}
          </button>
        )}
      </div>


      {/* Question Count */}
      {/* <div className="mb-4 text-gray-600 text-sm sm:text-base">
  Showing {displayQuestions.length} of {questions.length} questions
</div> */}
      {/* Main Content */}
      <div className="flex flex-col md:flex-row rounded-3xl shadow-lg overflow-hidden bg-white min-h-[80vh] max-w-6xl mx-auto">
        {/* Sidebar */}
        <aside className="hidden md:block md:w-1/5 bg-gray-900 text-white p-6">
          <div className="w-full bg-gray-900 text-white p-4 sm:p-6 flex flex-col items-start rounded-tr-2xl rounded-br-2xl shadow-xl">
            <h2 className="text-lg font-semibold mb-6 sm:mb-8">Categories</h2>
            <nav className="space-y-4 text-md w-full">
              {Object.keys(categoryMap).map((category) => (
                <div
                  key={category}
                  className={`font-medium cursor-pointer hover:text-purple-300 ${selectedCategory === category ? "text-purple-400" : "text-gray-400"
                    }`}
                  onClick={() => {
                    handleCategorySelect(category);
                  }}
                >
                  {category}
                </div>
              ))}
              {selectedCategory && (
                <div
                  className="text-gray-400 font-medium cursor-pointer hover:text-gray-300"
                  onClick={() => {
                    handleCategorySelect(null);
                  }}
                >
                  All Questions
                </div>
              )}
            </nav>
          </div>
        </aside>

        {/* Main Review */}
        <main className="flex-1 p-5 sm:p-10 overflow-y-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-8 sm:mb-10 text-gray-800">
            Mock Test Review
          </h2>

          {/* Question Count */}
          <div className="mb-4 text-gray-600 text-sm sm:text-base">
            Showing {displayQuestions.length} of {questions.length} questions
          </div>

          {displayQuestions.map((question, idx) => {
            const detail = evaluation.details.find(d => d.questionId === question._id);
            if (!detail) return null;

            return (
              <div key={question._id} className="mb-6 p-6 bg-white rounded-2xl shadow border border-gray-200">
                <h2 className="font-semibold text-lg mb-4 text-gray-800">
                  {idx + 1}. {question.questionText}
                  {question.subTestCategory && (
                    <span className="ml-2 text-sm text-gray-500">({question.subTestCategory})</span>
                  )}
                </h2>
                <ul className="space-y-3 mb-4">
                  {question.options.map((option, i) => (
                    <li
                      key={i}
                      className={`p-3 border rounded-lg ${getOptionStyle(question, i)} text-gray-800`}
                    >
                      {option.text}
                      {i === detail.selectedOptionIndex && (
                        <span className="ml-2 text-sm text-blue-700">(Your Answer)</span>
                      )}
                      {i === detail.correctOptionIndex && (
                        <span className="ml-2 text-sm text-green-700 font-bold">(Correct Answer)</span>
                      )}
                    </li>
                  ))}
                </ul>
                {question.explanation && (
                  <p className="text-sm text-gray-600">
                    <strong>Explanation:</strong> {question.explanation}
                  </p>
                )}
              </div>
            );
          })}

          <div className="text-center mt-10">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full shadow-lg transition"
            >
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MockTestResult;