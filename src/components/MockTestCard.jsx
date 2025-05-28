import React from "react";
import { format } from "date-fns";

const MockTestCard = ({ test, onClick }) => {
  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-5 cursor-pointer"
      onClick={onClick}
    >
      <h2 className="text-lg font-bold text-gray-800 mb-2">{test.name}</h2>
      <p className="text-sm text-gray-600 mb-3">{test.description}</p>
      {/* <p className="text-xs text-gray-400">
        Created on: {format(new Date(test.createdAt), "PPP")}
      </p> */}
    </div>
  );
};

export default MockTestCard;
