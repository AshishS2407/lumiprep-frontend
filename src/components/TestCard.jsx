import React from "react";

// Status colors based on test status
const statusColors = {
  Upcoming: "bg-purple-200 text-purple-700",
  Submitted: "bg-green-200 text-green-700",
  Expired: "bg-red-200 text-red-700",
};

const TestCard = ({ test, onClick }) => {
  const statusStyle = statusColors[test.status] || "bg-gray-200 text-gray-700";

  return (
    <div
      className="mt-2 md:mt-4 bg-gray-100 rounded-xl shadow-lg p-4 md:p-6 hover:scale-[1.02] transition-transform cursor-pointer w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto"
      onClick={onClick}
    >
      <div className="flex justify-between items-center mb-3">
        <span
          className={`text-xs sm:text-sm px-3 py-1 rounded-full font-medium ${statusStyle}`}
        >
          {test.status}
        </span>
      </div>
      <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-1 text-gray-800">
        {test.testTitle}
      </h2>
      <p className="text-sm text-gray-600">{test.description}</p>
    </div>
  );
};

export default TestCard;
