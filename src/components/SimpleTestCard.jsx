import React from "react";

const SimpleTestCard = ({ test, onClick }) => {
  return (
    <div
      className="mt-2 md:mt-4 bg-gray-100 rounded-xl shadow-lg p-4 md:p-6 hover:scale-[1.02] transition-transform cursor-pointer w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto"
      onClick={onClick}
    >
      <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-1 text-gray-800">
        {test.testTitle}
      </h2>
      <p className="text-sm text-gray-600">{test.description}</p>
    </div>
  );
};

export default SimpleTestCard;
