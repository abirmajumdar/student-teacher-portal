import React from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer,toast,Bounce } from "react-toastify";
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
    <div className="bg-white shadow-sm hover:shadow-md rounded-xl overflow-hidden border border-gray-200 transition-all duration-300 flex flex-col w-full max-w-md mx-auto">
      {/* Image */}
      <div className="flex justify-center pt-4">
        <div className="w-11/12 h-48 rounded-lg overflow-hidden">
          <img
            src={batch.image?.url || "https://via.placeholder.com/400x200?text=No+Image"}
            alt={batch.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
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

        {/* Action Button */}
        <div className="mt-6">
          <button
            onClick={showCourses}
            className="w-full bg-gray-100 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-200 transition text-sm"
          >
            📄 View Courses
          </button>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Bounce}
          />
        </div>
      </div>
    </div>


  );
};


export default BatchCard;
