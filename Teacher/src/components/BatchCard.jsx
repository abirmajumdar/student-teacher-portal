import React from "react";
import { useNavigate } from "react-router-dom";

const BatchCard = ({ batch }) => {
  const navigate = useNavigate();
  const showCourses = () => {
    if (localStorage.getItem('token')) {
      navigate(`/view-courses/${batch._id}`)
    }
    else {
      toast.error('Login to see courses', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
  }
  return (
    <div className="bg-white shadow-md rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 flex flex-col w-full max-w-md mx-auto">
      {/* Image */}
      <div className="h-44 w-full overflow-hidden">
        <img
          src={batch.image?.url || "https://via.placeholder.com/400x200?text=No+Image"}
          alt={batch.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-gray-800">{batch.title}</h3>
        <p className="mt-2 text-sm text-gray-600 line-clamp-3">{batch.description}</p>

        {/* Creator Info */}
        {batch.createdBy && (
          <p className="mt-3 text-xs text-gray-500 italic">
            Created by <span className="font-medium">{batch.createdBy.email}</span>
          </p>
        )}

        {/* Start Date */}
        {batch.startDate && (
          <p className="text-xs text-gray-400 mt-1">
            <strong>Start Date:</strong> {batch.startDate}
          </p>
        )}

        {/* Spacer */}
        <div className="flex-grow" />

        {/* Action Buttons */}
        <div className="mt-5 flex flex-col sm:flex-row sm:gap-4">
          <button
            onClick={() => navigate(`/course-upload/${batch._id}`)}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition text-sm"
          >
            ➕ Add Course
          </button>
          <button
            onClick={showCourses}
            className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition text-sm mt-2 sm:mt-0"
          >
            📄 View Courses
          </button>
        </div>
      </div>
    </div>
  );
};

export default BatchCard;
