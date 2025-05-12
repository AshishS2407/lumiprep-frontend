import { useNavigate } from "react-router-dom";
import { FaCertificate, FaDesktop, FaBookOpen, FaClock } from "react-icons/fa";

const TestInfoCard = ({ test }) => {
  const navigate = useNavigate();

  return (
    <div className="p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 max-w-4xl mx-auto mt-10 sm:mt-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{test.testTitle}</h2>
            <p className="text-gray-500 text-sm sm:text-base">{test.companyName}</p>
          </div>
          <button
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-5 py-2 rounded-full shadow-md hover:scale-105 transition sm:w-auto"
            onClick={() => navigate(`/start-test/${test._id}`)}
          >
            Start Test
          </button>
        </div>

        {/* Certification Note */}
        <div className="mt-4 bg-green-100 text-green-800 rounded-md px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm font-medium">
          <span>
            Certification: We will issue you a free <span className="underline">Certificate Of Achievement</span> if you score in the top 25%.
          </span>
        </div>

        {/* Test Info Table */}
        <div className="mt-6 text-sm text-gray-700 w-full">
          <div className="grid grid-cols-3 text-center font-medium text-gray-500 border-b pb-2">
            <div>Questions Type</div>
            <div>No Of Questions</div>
            <div>Level</div>
          </div>
          <div className="grid grid-cols-3 text-center py-2 border-b">
            <div>MCQ Questions</div>
            <div>{test.mcqCount || "10"} Questions</div>
            <div>{test.level || "Medium"}</div>
          </div>
          <div className="grid grid-cols-3 text-center py-2">
            <div>Programming Question</div>
            <div>{test.programmingCount || "10"} Questions</div>
            <div>{test.level || "Medium"}</div>
          </div>
        </div>

        {/* Test Preparation Info */}
        <div className="mt-6 p-4 rounded-xl border border-gray-300 bg-white flex flex-col gap-4 text-sm text-gray-600">
          <div className="flex items-start gap-2">
            <FaDesktop className="text-purple-500 mt-1" />
            <span>
              We recommend having an environment ready, so you can solve problems outside of the browser.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <FaBookOpen className="text-pink-500 mt-1" />
            <span>You can use any documentation, files, or other helpful resources.</span>
          </div>
          <div className="flex items-start gap-2">
            <FaClock className="text-indigo-500 mt-1" />
            <span>{test.duration || 30} Minutes (No breaks allowed)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestInfoCard;
