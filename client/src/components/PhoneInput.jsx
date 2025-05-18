import React, { useState } from 'react';




const PhoneInput = ({ setUser, setConfirmation }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState('+33');
  const [phoneNumber, setPhoneNumber] = useState('');


  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSelect = (value) => {
    setSelectedCode(value);
    setDropdownOpen(false);
  };

  const handleSendOTP = async (e) => {
    
    e.preventDefault();
    const fullPhoneNumber = selectedCode+phoneNumber
    console.log(fullPhoneNumber)
  

  
  };

  const options = [
    { label: 'France (+33)', value: '+33' },
    { label: 'Germany (+49)', value: '+49' },
    { label: 'Spain (+34)', value: '+34' },
    { label: 'USA (+1)', value: '+1' },
    { label: 'India (+91)', value: '+91' }
  ];

  return (
    <div className="w-full max-w-sm min-w-[200px] mt-4">
      <div className="relative mt-2">
        <div className="absolute top-2 left-0 flex items-center pl-3 z-20">
          <button
            onClick={toggleDropdown}
            className="h-full text-sm flex justify-center items-center bg-transparent text-slate-700 focus:outline-none"
          >
            <span>{selectedCode}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-4 w-4 ml-1"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
        </div>

        {dropdownOpen && (
          <div className="min-w-[150px] absolute top-10 left-0 bg-white border border-slate-200 rounded-md shadow-lg z-30">
            <ul>
              {options.map((option) => (
                <li
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className="px-4 py-2 text-slate-800 hover:bg-slate-100 text-sm cursor-pointer"
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="h-6 border-l border-slate-200 ml-20 absolute top-2 z-10" />

        <input
          type="number"
          className="w-full h-10 pl-24 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
          placeholder="324-456-2323"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <div id='recaptcha-container'></div>
        <br />
        <br />
        <label className="ml-0 block mb-1 text-sm text-slate-800">
          We’ll send an OTP for verification
        </label>
        <button
          onClick={handleSendOTP}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500 transition"
        >
          Join Now
        </button>
      </div>

      {/* IMPORTANT: This must be included! */}
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default PhoneInput;
