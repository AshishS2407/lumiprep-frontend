const MockTestQuestionCard = ({
  question,
  index,
  selectedAnswer,
  onSelect,
  subTestCategory
}) => {
  return (
    <div className="mb-6 p-6 bg-blue-50 rounded-2xl shadow border border-blue-200 relative">
      <div className="absolute top-4 right-4 bg-blue-200 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
        {subTestCategory}
      </div>
      <h3 className="font-semibold text-lg mb-4 text-blue-900">
        Q{index + 1}: {question.questionText}
      </h3>
      <ul className="space-y-3">
        {question.options.map((option, i) => (
          <li key={i}>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name={`mock-question-${question._id}`}
                value={i}
                checked={selectedAnswer === i}
                onChange={() => onSelect(question._id, i)}
                className="accent-blue-600 scale-125"
              />
              <span className="text-gray-800 text-md">{option.text}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MockTestQuestionCard;
