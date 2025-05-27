import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BASE_URL from '../utils/utils';
import { FaVideo, FaFileAlt, FaFilePdf, FaTasks, FaQuestion } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

export default function CoursesPage() {
  const { id } = useParams();
  const [courses, setCourses] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(true);
  const [quizLoading, setQuizLoading] = useState(true);
  const [assignmentLoading, setAssignmentLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState('videos');
  const [expandedQuizId, setExpandedQuizId] = useState(null);
  const [assignments, setAssignments] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/batch/get-courses-by-batchid/${id}`);
        setCourses(res.data.courses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchPdfs = async () => {
      try {
        setPdfLoading(true);
        const res = await axios.get(`${BASE_URL}/batch/get-pdfs-by-batchid/${id}`);
        setPdfs(res.data.pdfs);
      } catch (error) {
        console.error('Error fetching PDFs:', error);
      } finally {
        setPdfLoading(false);
      }
    };

    const fetchAssignments = async () => {
      try {
        setAssignmentLoading(true);
        const res = await axios.get(`${BASE_URL}/batch/get-assignments-by-batchid/${id}`);
        setAssignments(res.data.assignments);
        console.log(res.data)
        console.log(typeof (res.data))
      } catch (error) {
        console.error('Error fetching Assignments:', error);
      } finally {
        setAssignmentLoading(false);
      }
    };

    const fetchQuizzes = async () => {
      try {
        setQuizLoading(true);
        const res = await axios.get(`${BASE_URL}/batch/view-quiz-teacher/${id}`);
        setQuizzes(res.data.quizzes);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      } finally {
        setQuizLoading(false);
      }
    };

    fetchCourses();
    fetchPdfs();
    fetchQuizzes();
    fetchAssignments()
  }, [id]);

  const renderIcon = (type) => {
    switch (type) {
      case 'video':
        return <FaVideo className="text-blue-500" />;
      case 'text':
        return <FaFileAlt className="text-green-500" />;
      case 'pdf':
        return <FaFilePdf className="text-red-500" />;
      default:
        return null;
    }
  };

  const tabButtons = [
    { label: 'Videos', value: 'videos', icon: <FaVideo /> },
    { label: 'PDFs', value: 'pdfs', icon: <FaFilePdf /> },
    { label: 'Assignments', value: 'assignments', icon: <FaTasks /> },
    { label: 'Quiz', value: 'quiz', icon: <FaQuestion /> },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">📋 Course Materials</h1>

        {/* Tab Buttons */}
        <div className="flex justify-center mb-8 space-x-4">
          {tabButtons.map((tab) => (
            <button
              key={tab.value}
              className={`py-2 px-4 rounded-full font-semibold border ${selectedTab === tab.value
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-800 border-gray-300'
                } hover:bg-blue-100 transition`}
              onClick={() => setSelectedTab(tab.value)}
            >
              <div className="flex items-center space-x-2">
                {tab.icon}
                <span>{tab.label}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        {selectedTab === 'videos' && (
          <>
            {loading ? (
              <p className="text-center text-gray-500">Loading videos...</p>
            ) : courses.length === 0 ? (
              <p className="text-center text-gray-500">No videos available for this batch yet.</p>
            ) : (
              <ul className="space-y-4 mb-10">
                {courses
                  .filter((course) => course.contentType === 'video')
                  .map((course) => (
                    <li key={course._id} className="bg-white rounded-lg shadow-sm border p-5 flex justify-between hover:shadow-md">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{renderIcon(course.contentType)}</div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{course.title}</h3>
                          <p className="text-xs text-gray-500">
                            Created: {new Date(course.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => window.open(course.content?.url, '_blank')}
                        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 text-sm"
                      >
                        Watch Video
                      </button>
                    </li>
                  ))}
              </ul>
            )}
          </>
        )}

        {selectedTab === 'pdfs' && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">📄 PDFs</h2>
            {pdfLoading ? (
              <p className="text-center text-gray-500">Loading PDFs...</p>
            ) : pdfs.length === 0 ? (
              <p className="text-center text-gray-500">No PDFs uploaded yet.</p>
            ) : (
              <ul className="space-y-4">
                {pdfs.map((pdf) => (
                  <li key={pdf._id} className="bg-white rounded-lg shadow-sm border p-5 flex justify-between hover:shadow-md">
                    <div className="flex items-center space-x-4">
                      <FaFilePdf className="text-red-500 text-2xl" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{pdf.title}</h3>
                        <p className="text-xs text-gray-500">
                          Uploaded: {new Date(pdf.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => window.open(`${BASE_URL}/${pdf.pdf}`, '_blank')}
                      className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 text-sm"
                    >
                      Open PDF
                    </button>

                  </li>
                ))}
              </ul>
            )}
          </>
        )}


        {selectedTab === 'assignments' && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">📄 Assignments</h2>
            {assignmentLoading ? (
              <p className="text-center text-gray-500">Loading Assignments...</p>
            ) : pdfs.length === 0 ? (
              <p className="text-center text-gray-500">No assignments uploaded yet.</p>
            ) : (
              <ul className="space-y-4">
                {Array.isArray(assignments) && assignments.map((assignment) => (
                  <li key={assignment._id} className="bg-white rounded-lg shadow-sm border p-5 flex justify-between hover:shadow-md">
                    <div className="flex items-center space-x-4">
                      <FaFilePdf className="text-red-500 text-2xl" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{assignment.title}</h3>
                        <p className="text-xs text-gray-500">
                          Uploaded: {new Date(assignment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <Menu as="div" className="relative inline-block text-left">
                      <div>
                        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50">
                          Options
                          <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
                        </MenuButton>
                      </div>

                      <MenuItems
                        transition
                        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                      >
                        <div className="py-1">


                          <MenuItem>
                            <button

                              onClick={() => window.open(`${BASE_URL}/${assignment.pdf}`, '_blank')}
                              className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                            >
                              Assignment
                            </button>
                          </MenuItem>
                          <MenuItem>
                            <button
                              onClick={() => { navigate(`/all-assignments-by-Id/${assignment._id}`) }}
                              className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                            >
                              Action
                            </button>
                          </MenuItem>

                        </div>
                      </MenuItems>
                    </Menu>

                  </li>
                ))}

              </ul>
            )}
          </>
        )}
        {selectedTab === 'quiz' && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">📝 Quizzes</h2>
            {quizLoading ? (
              <p className="text-center text-gray-500">Loading quizzes...</p>
            ) : quizzes.length === 0 ? (
              <p className="text-center text-gray-500">No quizzes uploaded yet.</p>
            ) : (
              <ul className="space-y-4">
                {quizzes.map((quiz) => (
                  <li
                    key={quiz._id}
                    className="bg-white rounded-lg shadow-sm border p-5 hover:shadow-md cursor-pointer"
                    onClick={() =>
                      setExpandedQuizId(expandedQuizId === quiz._id ? null : quiz._id)
                    }
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-800">{quiz.title}</h3>
                      <p className="text-xs text-gray-500">
                        Questions: {quiz.questions.length} | Created:{' '}
                        {new Date(quiz.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {expandedQuizId === quiz._id && (
                      <div className="mt-4 space-y-4">
                        {quiz.questions.map((q, index) => (
                          <div key={index} className="bg-gray-100 p-4 rounded-lg border">
                            <p className="font-medium text-gray-800">
                              {index + 1}. {q.question}
                            </p>
                            <ul className="list-disc ml-5 mt-2 text-gray-700">
                              {q.options.map((option, i) => (
                                <li key={i}>{option}</li>
                              ))}
                            </ul>
                            <p className="mt-2 text-sm text-green-600">
                              ✅ Correct Answer: <strong>{q.correctAnswer}</strong>
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

      </div>
    </>


  );
}
