import React from "react";

const SimpleTestCard = ({ test, onClick }) => {
  return (
    <div
      className="mt-2 md:mt-4 bg-gray-100 rounded-xl shadow-lg p-6 hover:scale-[1.02] transition-transform cursor-pointer w-96 mx-auto"
      onClick={onClick}
    >
      <h2 className="text-lg font-semibold mb-1">{test.testTitle}</h2>
      <p className="text-sm text-gray-500">{test.description}</p>
    </div>
  );
};

export default SimpleTestCard;