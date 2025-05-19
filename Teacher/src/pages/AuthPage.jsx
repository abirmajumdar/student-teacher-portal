import React, { useState } from 'react';
import BASE_URL from '../../utils/utils.js';
import {ToastContainer,toast,Bounce} from 'react-toastify'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import Lottie from "lottie-react";
import animationData from "../assets/Animation - 1747640543473.json";


export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [fullname,setFullname]= useState('')
  const [email,setEmail]= useState('')
  const [password,setPassword]= useState('')
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()
    if (isLogin) {
      try {
        const res = await axios.post(`${BASE_URL}/auth/teacher/login`,{email,password})
        localStorage.setItem('token',res.data.token)
        localStorage.setItem('teacher',JSON.stringify(res.data.teacher.email) )
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
          onClose:()=>{navigate('/dashboard')}
        });
        
        
      }
      catch (e) {
        console.log(e)
        toast.error('Invalid creadentials', {
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
    else {
      //password == cnf password
      try{
        const res = await axios.post(`${BASE_URL}/auth/teacher/signup`,{fullname,email,password})
        localStorage.setItem('token',res.data.token)
        localStorage.setItem('teacher',res.data.teacher)
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
          onClose:()=>{navigate('/dashboard')}
        });
      }
      catch(e){
        console.log(e)
         toast.error('Invalid creadentials', {
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
  }
  return (
  <div className="relative min-h-screen flex items-center justify-center ">
    {/* Lottie animation as fullscreen background */}
    <div className="absolute inset-0 -z-10">
      <Lottie
        animationData={animationData}
        loop={true}
        autoplay={true}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>

    {/* Form container with translucent background */}
    <div className="backdrop-blur-sm bg-white/20 p-8 rounded-2xl shadow-2xl max-w-md w-full">
      <h1 className="text-grey-200 text-3xl font-bold text-center mb-6">Welcome to EduLearn</h1>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => setIsLogin(true)}
          className={`px-4 py-2 rounded-l-full transition ${
            isLogin ? "bg-grey-600 text-white" : "bg-white text-indigo-600 hover:bg-gray-100"
          }`}
        >
          Login
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

        <button
          onClick={() => setIsLogin(false)}
          className={`px-4 py-2 rounded-r-full transition ${
            !isLogin ? "bg-indigo-600 text-white" : "bg-white text-indigo-600 hover:bg-gray-100"
          }`}
        >
          Register
        </button>
      </div>

      {isLogin ? (
        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded bg-white/30 focus:outline-none"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded bg-white/30 focus:outline-none"
            required
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button
            onClick={submitHandler}
            className="w-full bg-indigo-600 bg-opacity-80 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            Login
          </button>
        </form>
      ) : (
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-2 rounded bg-white/30 focus:outline-none"
            required
            value={fullname}
            onChange={(e) => {
              setFullname(e.target.value);
            }}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded bg-white/30 focus:outline-none"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded bg-white/30 focus:outline-none"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full px-4 py-2 rounded bg-white/30 focus:outline-none"
            required
          />
          <button
            onClick={submitHandler}
            className="w-full bg-indigo-600 bg-opacity-80 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            Register
          </button>
        </form>
      )}
    </div>
  </div>
);
}
