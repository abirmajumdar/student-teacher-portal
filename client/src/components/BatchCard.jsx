import React from "react";
import { useNavigate } from "react-router-dom";

const BatchCard = ({ batch }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow-lg rounded-xl p-5 border hover:shadow-xl transition flex flex-col h-80">
      <div>
        <h3 className="text-xl font-semibold text-blue-700">{batch.title}</h3>
        <p className="mt-2 text-sm text-gray-600">{batch.description}</p>
        <p className="mt-4 text-sm text-gray-500">
          <strong>Start Date:</strong> {batch.startDate}
        </p>
      </div>

      {/* Spacer to push button down */}
      <div className="flex-grow" />

      <button
        onClick={() => navigate(`/batch/${batch.id}`)}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500 transition"
      >
        Join Now
      </button>
    </div>
  );
};

export default BatchCard;
