import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import UploadModal from './UploadModal';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'
const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isModelOpen,setisModalOpen] = useState(false)
    // Replace this with real auth state
    const user = {isLoggedIn: false };

    const navigate = useNavigate()

    const handleLogout=async(e)=>{
        e.preventDefault()
        console.log("working")
        localStorage.clear()
        navigate('/auth')
        
    }
    const showAllBatches=async(e)=>{
        e.preventDefault()
        navigate('/all-batches')
    }

    return (
        <>
        <nav className="bg-slate-200 shadow">
            <div className="px-6 py-4 mx-auto md:flex md:justify-between md:items-center">
                {/* Logo + Toggle */}
                <div className="flex items-center justify-between">
                    <Link to="/">
                        <img
                            className="w-auto h-6 sm:h-7"
                            src={logo}
                            alt="Logo"
                        />
                    </Link>
                    <h1 className='p-2 font-bold text-gray-700 text-2xl'>Tuteva</h1>
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
                        <div className="mt-2 md:mt-0 text-gray-700 hover:text-blue-500" onClick={showAllBatches}>
                            All Batches
                        </div>
                        <div className="mt-2 md:mt-0 text-gray-700 hover:text-blue-500" onClick={()=>{setisModalOpen(true)}}>
                            Add Batches
                        </div>
                        {/* <Link to="/notification" className="mt-2 md:mt-0 text-gray-700 hover:text-blue-500">
                            Notification
                        </Link> */}
                    </div>

                    <div className="ml-0 mt-3 md:ml-4 md:mt-0">
                            <button className="px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600" onClick={handleLogout}>
                                Logout
                            </button>
                       
                    </div>
                </div>
            </div>
        </nav>
        <Dialog open={isModelOpen} onClose={setisModalOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >


                        <UploadModal closeModal ={()=>{
                            setisModalOpen(false)
                        }}/>

          </DialogPanel>
        </div>
      </div>
    </Dialog>
        </>
    );
};

export default Navbar;