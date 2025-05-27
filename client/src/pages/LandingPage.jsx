
import React from 'react';
import Navbar from './NavbarPage';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import BatchList from '../components/BatchList';
import bgteaching from '../assets/bg-teaching.json'
import Lottie from 'lottie-react'
import Contact from '../components/Contact';
import { useState } from 'react';
import PhoneInput from '../components/PhoneInput';
import OTPVerify from '../components/VerifyOtp';
import 'react-phone-number-input/style.css'
import { useRef } from "react";
import axios from 'axios'
import { ToastContainer, toast, Bounce } from 'react-toastify';
import BASE_URL from '../../../Teacher/utils/utils';
import { useNavigate } from 'react-router-dom';

const countryOptions = [
  { name: "United States", code: "+1", flag: "🇺🇸" },
  { name: "India", code: "+91", flag: "🇮🇳" },
  { name: "United Kingdom", code: "+44", flag: "🇬🇧" },
  { name: "Canada", code: "+1", flag: "🇨🇦" },
  { name: "Australia", code: "+61", flag: "🇦🇺" }
];

const LandingPage = () => {
  const [value, setValue] = useState()
  const [user, setUser] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [email, setEmail] = useState("")


  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputsRef = useRef([]);

  const navigate = useNavigate()
  
  const sendOtp = async () => {

    const res = await axios.post(`${BASE_URL}/otp/send-otp`, { email })
    console.log(res)
    document.getElementById('my_modal_1').showModal()
  }

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const finalOtp = otp.join("");
    console.log("OTP to send:", finalOtp);
    console.log(typeof (finalOtp))
    try {
      const res = await axios.post(`${BASE_URL}/otp/verify-otp`, { email: email, otp: finalOtp })
      toast.success(res.data.message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
        onClose: () => {
          document.getElementById('my_modal_1').close();
          navigate('/')
        }
      });
      localStorage.setItem('token', JSON.stringify(res.data.token))




    }
    catch (e) {
      toast.error("incorrect otp", {
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

  return (
    <div className="bg-white">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <div className="lg:flex">
        {/* Left side text */}
        <div className="flex items-center justify-center w-full px-6 py-8 lg:h-[32rem] lg:w-1/2">
          <div className="max-w-xl">
            <h2 className="text-3xl font-semibold text-gray-800 lg:text-4xl">
              Manage Your <span className="text-blue-600">Batches & Roles</span>
            </h2>
            <p className="mt-4 text-sm text-gray-500 lg:text-base">
              A simple MERN stack app to manage batches, teachers, and students with verification
              control from the admin panel.
            </p>
            <div className="flex flex-col mt-6 space-y-3 lg:space-y-0 lg:flex-row">
              <a
                href="/login"
                className="block px-5 py-2 text-sm font-medium text-center text-white bg-gray-900 rounded-md hover:bg-gray-700"
              >
                Get Started
              </a>
              <a
                href="/about"
                className="block px-5 py-2 text-sm font-medium text-center text-gray-700 bg-gray-200 rounded-md lg:mx-4 hover:bg-gray-300"
              >
                Learn More
              </a>
            </div>
            <br />

            <div className="flex flex-col mt-6 space-y-3 lg:space-y-0 lg:flex-row">



              <div className="join" data-theme="light" >
                <div>

                  <label className="input join-item flex items-center gap-2 border rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        fill="none"
                        stroke="currentColor"
                      >
                        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                      </g>
                    </svg>
                    <input
                      className="w-full border-none outline-none bg-transparent placeholder-gray-400"
                      type="email"
                      placeholder="mail@site.com"
                      required
                      value={email}
                      onChange={(e) => { setEmail(e.target.value) }}
                    />
                  </label>
                  <div className="text-sm text-red-500 mt-1 hidden validator-hint">
                    Enter valid email address
                  </div>
                </div>

                <button
                  data-theme="light"
                  className="btn bg-blue-400 text-white hover:bg-blue-500 join-item px-5"
                  onClick={sendOtp}
                >
                  Login
                </button>

              </div>


            </div>
            <br />
            <p className="text-sm text-gray-700">Please verify your email to continue for the first time.</p>

          </div>

        </div>

        <Lottie animationData={bgteaching} />
      </div>
      <BatchList />
      <Contact />
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box max-w-sm">
          <h3 className="font-bold text-xl text-center mb-4">Verify Your Email</h3>
          <p className="text-sm text-gray-600 text-center mb-6">
            Enter the 6-digit OTP sent to your email address.
          </p>

          {/* OTP Inputs */}
          <div className="flex justify-center gap-2 mb-6">
            {otp.map((digit, i) => (
              <input
                key={i}
                type="text"
                maxLength="1"
                value={digit}
                ref={(el) => (inputsRef.current[i] = el)}
                onChange={(e) => handleChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className="w-10 h-12 text-center border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button className="btn btn-primary w-full" onClick={handleSubmit}>
              Verify OTP
            </button>
            <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick={false}
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
              transition={Bounce}
            />
          </div>

          {/* Close Option */}
          <div className="modal-action mt-6 justify-center">
            <form method="dialog">
              <button className="text-sm text-blue-600 hover:underline">Cancel</button>
            </form>
          </div>
        </div>
      </dialog>

    </div>
  );
};

export default LandingPage;
