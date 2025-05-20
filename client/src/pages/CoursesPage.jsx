import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BASE_URL from '../../../Teacher/utils/utils.js';
import { FaVideo, FaFileAlt, FaFilePdf, FaTasks, FaQuestion } from 'react-icons/fa';

export default function CoursesPage() {
  const { id } = useParams();
  const [courses, setCourses] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(true);
  const [quizLoading, setQuizLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('videos');
  const [expandedQuizId, setExpandedQuizId] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizResults, setQuizResults] = useState({});

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
  }, [id]);



  // Handler for answer selection
  const handleAnswerChange = (quizId, questionId, answer) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [quizId]: {
        ...prev[quizId],
        [questionId]: answer,
      },
    }));
  };
  const submitQuiz = async (quiz) => {
    const token = localStorage.getItem('token');
    const answersObj = selectedAnswers[quiz._id] || {};

    // Prepare payload
    const answersPayload = quiz.questions.map((q) => ({
      questionId: q._id,
      answer: answersObj[q._id] || '', // default empty if not answered
    }));

    try {
      const res = await axios.post(
        `${BASE_URL}/batch/quiz/${quiz._id}/submit`,
        { answers: answersPayload }, // ✅ send only answers
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ token in headers
          },
        }
      );

      setQuizResults((prev) => ({
        ...prev,
        [quiz._id]: {
          score: res.data.score,
          total: res.data.total,
          submitted: true,
        },
      }));

      alert(`Quiz submitted! Your score: ${res.data.score} / ${res.data.total}`);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz. Please try again.');
    }
  };


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
        <div className="text-center text-gray-500">🛠 Assignment section coming soon...</div>
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
                  onClick={(e) => {
                    e.preventDefault(); // ⛔ prevent default navigation
                    e.stopPropagation(); // 🔒 prevent bubbling if needed
                    setExpandedQuizId(expandedQuizId === quiz._id ? null : quiz._id);
                  }}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">{quiz.title}</h3>
                    <p className="text-xs text-gray-500">
                      Questions: {quiz.questions.length} | Created:{' '}
                      {new Date(quiz.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {expandedQuizId === quiz._id && (
                    <div className="mt-4 space-y-6">
                      {quiz.questions.map((q, index) => (
                        <div key={index} className="bg-gray-100 p-4 rounded-lg border">
                          <p className="font-medium text-gray-800">
                            {index + 1}. {q.question}
                          </p>
                          <ul className="list-disc ml-5 mt-2 text-gray-700">
                            {q.options.map((option, i) => (
                              <li key={i}>
                                <label className="cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`quiz-${quiz._id}-question-${q._id}`}
                                    value={option}
                                    checked={
                                      selectedAnswers[quiz._id]?.[q._id] === option
                                    }
                                    onChange={() =>
                                      handleAnswerChange(quiz._id, q._id, option)
                                    }
                                     onClick={e => e.stopPropagation()}
                                    className="mr-2"
                                  />
                                  {option}
                                </label>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}

                      {/* Show result if submitted */}
                      {quizResults[quiz._id]?.submitted && (
                        <p className="text-green-600 font-semibold">
                          You scored {quizResults[quiz._id].score} out of {quizResults[quiz._id].total}
                        </p>
                      )}

                      {/* Submit button */}
                      {!quizResults[quiz._id]?.submitted && (
                        <button
                          onClick={() => submitQuiz(quiz)}
                          className="mt-4 bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
                        >
                          Submit Quiz
                        </button>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      )}

    </div>
  );
}
