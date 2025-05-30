const MockTestQuestionCard = ({
  question,
  index,
  selectedAnswer,
  onSelect,
  subTestCategory,
}) => {
  return (
    <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-4 sm:p-6 mb-6 transition-shadow hover:shadow-md">
      {/* Category Badge */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {index + 1}. {question.questionText}
        </h3>
        <span className="text-xs bg-indigo-100 text-indigo-700 font-semibold px-3 py-1 rounded-full shadow-sm">
          {subTestCategory}
        </span>
      </div>

      {/* Options */}
      <ul className="space-y-3">
        {question.options.map((option, i) => {
          const isSelected = selectedAnswer === i;

          return (
            <li key={i}>
              <label
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg border text-sm font-medium cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "bg-green-50 border-green-500 text-green-800"
                    : "bg-white border-gray-300 hover:border-indigo-400 hover:bg-indigo-50"
                }`}
              >
                <input
                  type="radio"
                  name={`mock-question-${question._id}`}
                  value={i}
                  checked={isSelected}
                  onChange={() => onSelect(question._id, i)}
                  className="accent-indigo-600 scale-110"
                />
                <span className="text-gray-800">{option.text}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MockTestQuestionCard;
