
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast, Bounce } from "react-toastify";
import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const BASE_URL = "https://yourdomain.com"; // Replace with your actual BASE_URL

const BatchCard = ({ batch, assignment }) => {
  const navigate = useNavigate();

  const showCourses = () => {
    if (localStorage.getItem('token')) {
      navigate(`/view-courses/${batch._id}`);
    } else {
      toast.error('Login to see courses', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

 const handleStartLiveClass = () => {
  window.open(`https://video-call-and-classes.vercel.app/`, "_blank");
};

  return (
    <div className="bg-white shadow-md rounded-2xl overflow-visible border border-gray-200 hover:shadow-lg transition-all duration-300 flex flex-col w-full min-h-1500 max-w-md mx-auto">
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

        {batch.createdBy && (
          <p className="mt-3 text-xs text-gray-500 italic">
            Created by <span className="font-medium">{batch.createdBy.email}</span>
          </p>
        )}

        {batch.startDate && (
          <p className="text-xs text-gray-400 mt-1">
            <strong>Start Date:</strong> {batch.startDate}
          </p>
        )}

        <div className="flex-grow" />

        {/* Action Buttons */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
          {/* Menu with right-aligned dropdown */}
          <Menu as="div" className="relative inline-block text-left">
            <div className="flex items-center">
              <Menu.Button className="inline-flex justify-center items-center w-full gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 h-10">
                Options
                <ChevronDownIcon className="-mr-1 size-5 text-gray-400" aria-hidden="true" />
              </Menu.Button>

              <Menu.Items className="absolute left-full top-0 ml-2 w-48 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => navigate(`/course-upload/${batch._id}`)}
                        className={`block w-full px-4 py-2 text-left text-sm ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                          }`}
                      >
                        ➕ Add Course
                      </button>
                    )}
                  </Menu.Item>

                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={showCourses}
                        className={`block w-full px-4 py-2 text-left text-sm ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                          }`}
                      >
                        📘 View Courses
                      </button>
                    )}
                  </Menu.Item>

                  <Menu.Item>
                    {({ active }) => (
                      
          <button
            onClick={handleStartLiveClass}
             className={`block w-full px-4 py-2 text-left text-sm ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                          }`}
          >
            🎥 Start Live Class
          </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </div>
          </Menu>

          {/* Main Buttons */}


        </div>
      </div>
    </div>
  );
};

export default BatchCard;
