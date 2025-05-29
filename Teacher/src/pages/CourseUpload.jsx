import React, { useState } from 'react';
import axios from 'axios';
import BASE_URL from '../utils/utils.js';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Bounce } from 'react-toastify';

const CourseUpload = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('video');

    const [formData, setFormData] = useState({
        title: '',
        contentType: 'video',
        email: '',
        content: null,
        textContent: '',
    });

    const [pdfFile, setPdfFile] = useState(null);
    const [pdfTitle, setPdfTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [assignmentTitle,setAssignmentTitle] = useState('')
    const [assignmentFile,setAssignmentFile]=useState(null)
    const [totalMarks,setTotalMarks] = useState('')
    // Quiz States
    const [quizTitle, setQuizTitle] = useState('');
    const [questions, setQuestions] = useState([
        { question: '', options: ['', '', '', ''], correctAnswer: 0 },
    ]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setFormData((prev) => ({ ...prev, contentType: tab }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({ ...prev, content: e.target.files[0] }));
    };

    const handleTextChange = (e) => {
        setFormData((prev) => ({ ...prev, textContent: e.target.value }));
    };

    const handleCourseSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const form = new FormData();
        const { title, contentType, email, content, textContent } = formData;

        form.append('title', title);
        form.append('contentType', contentType);
        form.append('batchId', id);
        form.append('email', email);
        if (contentType === 'text') {
            form.append('textContent', textContent);
        } else {
            form.append('content', content);
        }

        try {
            const response = await axios.post(`${BASE_URL}/batch/add-course/${id}`, form, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success(response.data.message, {
                position: 'top-center',
                autoClose: 4000,
                theme: 'dark',
                transition: Bounce,
                onClose: () => navigate('/dashboard'),
            });
        } catch (err) {
            setError('Failed to add course.');
        } finally {
            setLoading(false);
        }
    };

    const handlePdfChange = (e) => {
        setPdfFile(e.target.files[0]);
    };
    const handleassignmentChange = (e) => {
        setAssignmentFile(e.target.files[0]);
    };


    const handlePdfSubmit = async (e) => {
        e.preventDefault();
        if (!pdfFile) {
            toast.error('Please select a PDF file.', { theme: 'colored' });
            return;
        }

        const pdfForm = new FormData();
        pdfForm.append('pdf', pdfFile);
        pdfForm.append('title', pdfTitle);

        try {
            const res = await axios.post(`${BASE_URL}/batch/upload-pdf/${id}`, pdfForm, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('PDF uploaded successfully!', { theme: 'colored' });
        } catch (err) {
            toast.error('Failed to upload PDF.', { theme: 'colored' });
        }
    };

    const handleAssignmentSubmit=async(e)=>{
         e.preventDefault();
        
        if (!assignmentFile) {
            toast.error('Please select a PDF file.', { theme: 'colored' });
            return;
        }
         if (!totalMarks || ! assignmentTitle) {
            toast.error('All fields are required *', { theme: 'colored' });
            return;
        }

        const pdfForm = new FormData();
        pdfForm.append('title', assignmentTitle);
        pdfForm.append('pdf', assignmentFile);
        pdfForm.append('totalMarks',totalMarks)

        try {
            const res = await axios.post(`${BASE_URL}/batch/upload-assignment/${id}`, pdfForm, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Assignment uploaded successfully!', { theme: 'colored' });
        } catch (err) {
            toast.error('Failed to upload PDF.', { theme: 'colored' });
        }
    }
    const handleQuizSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${BASE_URL}/batch/upload-quiz/${id}`, {
                title: quizTitle,
                questions,
            });
            toast.success(res.data.message || 'Quiz uploaded successfully.', { theme: 'colored' });
            setQuizTitle('');
            setQuestions([{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]);
        } catch (err) {
            toast.error('Failed to upload quiz.', { theme: 'colored' });
        }
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = value;
        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        setQuestions([...questions, { question: '', options: ['', '', '', ''], correctAnswer: 0 }]);
    };

    const removeQuestion = (index) => {
        const newQuestions = [...questions];
        newQuestions.splice(index, 1);
        setQuestions(newQuestions);
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-8">
            <h2 className="text-2xl font-bold text-center text-indigo-700">📚 Upload Content</h2>

            {/* Tab Buttons */}
            <div className="flex justify-center space-x-4 mb-4 flex-wrap">
                {['video', 'pdf', 'assignment', 'quiz'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => handleTabChange(tab)}
                        className={`px-4 py-2 rounded-md font-medium ${activeTab === tab
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                            }`}
                    >
                        {{
                            video: '🎥 Videos',
                            pdf: '📄 PDFs',
                            assignment: '📝 Assignment',
                            quiz: '❓ Quiz',
                        }[tab]}
                    </button>
                ))}
            </div>

            {/* Content Upload Forms */}
            {activeTab === 'quiz' ? (
                <form onSubmit={handleQuizSubmit} className="space-y-4">
                    <h3 className="text-lg font-bold text-indigo-600">Add Quiz</h3>
                    <input
                        type="text"
                        placeholder="Quiz Title"
                        value={quizTitle}
                        onChange={(e) => setQuizTitle(e.target.value)}
                        required
                        className="w-full border px-3 py-2 rounded-md"
                    />

                    {questions.map((q, index) => (
                        <div key={index} className="border p-4 rounded-md space-y-2 bg-gray-50">
                            <input
                                type="text"
                                placeholder={`Question ${index + 1}`}
                                value={q.question}
                                onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                                required
                                className="w-full border px-3 py-2 rounded-md"
                            />

                            {q.options.map((opt, optIndex) => (
                                <input
                                    key={optIndex}
                                    type="text"
                                    placeholder={`Option ${optIndex + 1}`}
                                    value={opt}
                                    onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
                                    required
                                    className="w-full border px-3 py-2 rounded-md"
                                />
                            ))}

                            <label className="block mt-2">
                                Correct Answer:
                                <select
                                    className="ml-2 border px-2 py-1 rounded-md"
                                    value={q.correctAnswer}
                                    onChange={(e) =>
                                        handleQuestionChange(index, 'correctAnswer', parseInt(e.target.value))
                                    }
                                >
                                    {q.options.map((_, i) => (
                                        <option key={i} value={i}>
                                            Option {i + 1}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            {questions.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeQuestion(index)}
                                    className="text-red-500 text-sm"
                                >
                                    ❌ Remove Question
                                </button>
                            )}
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addQuestion}
                        className="text-indigo-600 font-medium"
                    >
                        ➕ Add Another Question
                    </button>

                    <button
                        type="submit"
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md"
                    >
                        Upload Quiz
                    </button>
                </form>
            ) : activeTab === 'pdf' ? (
                <form onSubmit={handlePdfSubmit} className="space-y-4">
                    <h3 className="text-lg font-bold text-indigo-600">Upload PDF Only</h3>
                    <input
                        type="text"
                        placeholder="PDF Title"
                        value={pdfTitle}
                        onChange={(e) => setPdfTitle(e.target.value)}
                        required
                        className="w-full border px-3 py-2 rounded-md"
                    />
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={handlePdfChange}
                        className="w-full border px-3 py-2 rounded-md"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md"
                    >
                        📄 Upload PDF
                    </button>
                </form>
            ) : activeTab === 'assignment' ?(
                <form onSubmit={handleAssignmentSubmit} className="space-y-4">
                    <h3 className="text-lg font-bold text-indigo-600">Upload PDF Only</h3>
                    <input
                        type="text"
                        placeholder="Assignment Title"
                        value={assignmentTitle}
                        onChange={(e) => setAssignmentTitle(e.target.value)}
                        required
                        className="w-full border px-3 py-2 rounded-md"
                    />
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleassignmentChange}
                        className="w-full border px-3 py-2 rounded-md"
                        required
                    />
                    <input
                        value={totalMarks}
                        onChange={(e)=>{setTotalMarks(e.target.value)}}
                        placeholder='total marks'
                        className="w-full border px-3 py-2 rounded-md"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md"
                    >
                        📄 Upload Assignment
                    </button>
                </form>
            ) :(
                <form onSubmit={handleCourseSubmit} className="space-y-4 border-b pb-6">
                    <h3 className="text-lg font-bold text-indigo-600">Add {activeTab === 'text' ? 'Assignment' : 'Course'}</h3>
                    <input
                        type="text"
                        name="title"
                        placeholder={`${activeTab === 'text' ? 'Assignment' : 'Course'} Title`}
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full border px-3 py-2 rounded-md"
                    />

                    {activeTab === 'text' ? (
                        <>
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileChange}
                                required
                                className="w-full border px-3 py-2 rounded-md"
                            />
                            <p className="text-sm text-gray-600">Upload assignment in PDF format.</p>
                        </>
                    ) : (
                        <input
                            type="file"
                            onChange={handleFileChange}
                            accept={activeTab === 'pdf' ? 'application/pdf' : 'video/*'}
                            className="w-full border px-3 py-2 rounded-md"
                            required
                        />
                    )}

                    <input
                        type="email"
                        name="email"
                        placeholder="Teacher's Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full border px-3 py-2 rounded-md"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 rounded-md text-white font-semibold ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                    >
                        {loading ? 'Uploading...' : `Upload ${activeTab === 'text' ? 'Assignment' : 'Course'}`}
                    </button>
                </form>
            )}

            <ToastContainer />
        </div>
    );
};

export default CourseUpload;
