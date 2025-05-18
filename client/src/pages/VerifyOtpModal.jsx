import React from "react";
import LoginCard from "../components/LoginCard";
import VerifyOtp from "../components/VerifyOtp";

const VerifyOtpModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <VerifyOtp />
      </div>
    </div>
  );
};

export default VerifyOtpModal;
