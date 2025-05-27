import React, { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [user,setUser] = useState(null)
    // Replace this with real auth state
    useEffect(()=>{
        setUser(localStorage.getItem('token'))
    },[localStorage.getItem('token')])

    const handleLogout=()=>{
        localStorage.removeItem('token')
        setUser(null)
    }

   
    return (
        <>
        <nav className="bg-slate-200 shadow">
            <div className="px-6 py-4  mx-auto md:flex md:justify-between md:items-center">
                {/* Logo + Toggle */}
                <div className="flex items-center justify-between">
                    <Link to="/">
                        <img
                            className="w-auto h-6 sm:h-7"
                            src="https://merakiui.com/images/full-logo.svg"
                            alt="Logo"
                        />
                    </Link>

                    <div className="flex lg:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-600 hover:text-gray-800 focus:outline-none"
                        >
                            {isOpen ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                <div className={`transition-all duration-300 ease-in-out md:flex md:items-center ${isOpen ? 'block' : 'hidden'}`}>
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
                        <Link to="/" className="mt-2 md:mt-0 text-gray-700 hover:text-blue-500">
                            Home
                        </Link>
                        <Link to="/batches" className="mt-2 md:mt-0 text-gray-700 hover:text-blue-500">
                            Batches
                        </Link>
                        <Link to="/about" className="mt-2 md:mt-0 text-gray-700 hover:text-blue-500">
                            About
                        </Link>

                        {user && (
                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="mt-2 md:mt-0 text-gray-700 hover:text-blue-500 focus:outline-none"
                                >
                                    Cart
                                </button>
                                {dropdownOpen && (
                                    <div className="absolute left-0 mt-2 w-40 bg-white border rounded shadow-lg z-20">
                                        
                                         
                                            <>
                                                <Link to="/student/join-batch" className="block px-4 py-2 text-sm hover:bg-gray-100">
                                                    Join Batch
                                                </Link>
                                                <Link to="/student/my-courses" className="block px-4 py-2 text-sm hover:bg-gray-100">
                                                    My Courses
                                                </Link>
                                            </>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="ml-0 mt-3 md:ml-4 md:mt-0">
                        {user? (
                            <button onClick={handleLogout} className="px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600">
                                Logout
                            </button>
                        ) : null}
                    </div>
                </div>
            </div>
        </nav>
        </>
    );
};

export default Navbar;