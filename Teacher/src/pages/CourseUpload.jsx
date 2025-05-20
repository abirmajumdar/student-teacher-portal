import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../utils/utils';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Bounce } from 'react-toastify';

const CourseUpload = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        contentType: 'video',
        email: '',
        content: null,
        textContent: '',
    });

    const [pdfFile, setPdfFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [pdfTitle, setPdfTitle] = useState('');

    // Handlers for course upload form
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
        form.append('batchId', id); // use batchId from URL
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

    // Handlers for PDF upload
    const handlePdfChange = (e) => {
        setPdfFile(e.target.files[0]);
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

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-10">
            <h2 className="text-2xl font-semibold text-center text-indigo-700">📚 Course & PDF Upload</h2>

            {/* Course Upload Form */}
            <form onSubmit={handleCourseSubmit} className="space-y-4 border-b pb-6">
                <h3 className="text-lg font-bold text-indigo-600">Add Course</h3>
                <input
                    type="text"
                    name="title"
                    placeholder="Course Title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full border px-3 py-2 rounded-md"
                />
                <select
                    name="contentType"
                    value={formData.contentType}
                    onChange={handleChange}
                    required
                    className="w-full border px-3 py-2 rounded-md"
                >
                    <option value="video">Video</option>
                    <option value="pdf">PDF</option>
                    <option value="text">Text</option>
                </select>

                {formData.contentType === 'text' ? (
                    <textarea
                        name="textContent"
                        rows="4"
                        placeholder="Enter text content"
                        value={formData.textContent}
                        onChange={handleTextChange}
                        required
                        className="w-full border px-3 py-2 rounded-md"
                    />
                ) : (
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept={formData.contentType === 'pdf' ? 'application/pdf' : 'video/*'}
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
                    className={`w-full py-2 rounded-md text-white font-semibold ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                >
                    {loading ? 'Uploading...' : 'Add Course'}
                </button>
            </form>

            {/* PDF Upload Form */}
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


            <ToastContainer />
        </div>
    );
};

export default CourseUpload;
