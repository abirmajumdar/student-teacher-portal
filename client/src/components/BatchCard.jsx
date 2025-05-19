import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import axios from "axios";
import BASE_URL from "../../../Teacher/utils/utils";

const BatchCard = ({ batch }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [batchPassword, setBatchPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const showCourses = () => {
    if (localStorage.getItem('token')) {
      setShowModal(true); // Show password modal
    } else {
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
  };

  const handlePasswordSubmit = async () => {
    if (!batchPassword.trim()) {
      toast.warn("Please enter the batch password", { theme: "dark", transition: Bounce });
      return;
    }

    setIsVerifying(true);
    console.log(batchPassword)
    try {
      const response = await axios.post(`${BASE_URL}/batch/verify-batch-password`, {
        batchId: batch._id,
        password:batchPassword,
      });
      if (response.status==200) {




        
        //success toast


        toast.success('Batch password verified successfully!', {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    onClose:()=>{setShowModal(false);
        navigate(`/view-courses/${batch._id}`);}
  });
        
      } else {
        toast.error("Incorrect batch password", {
          position: "top-center",
          theme: "dark",
          transition: Bounce,
        });
      }
    } catch (error) {
      toast.error("Error verifying password", {
        position: "top-center",
        theme: "dark",
        transition: Bounce,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <>
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

          <div className="flex-grow" />

          {/* Action Button */}
          <div className="mt-6">
            <button
              onClick={showCourses}
              className="w-full bg-gray-100 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-200 transition text-sm"
            >
              📄 View Courses
            </button>
            <ToastContainer />
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <dialog open className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-2">Enter Batch Password</h3>
            <input
              type="password"
              placeholder="Batch Password"
              value={batchPassword}
              onChange={(e) => setBatchPassword(e.target.value)}
              className="input input-bordered w-full"
              disabled={isVerifying}
            />
            <div className="modal-action">
              <button className="btn" onClick={() => setShowModal(false)} disabled={isVerifying}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handlePasswordSubmit}
                disabled={isVerifying}
              >
                {isVerifying ? "Verifying..." : "Submit"}
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
};

export default BatchCard;
