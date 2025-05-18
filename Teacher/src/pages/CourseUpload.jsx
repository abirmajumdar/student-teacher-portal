import React, { useState,useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../utils/utils';
import { useParams } from 'react-router-dom';

const CourseUpload = () => {
    const [batches,setBatches] = useState([])
    const {id} = useParams()
    useEffect(() => {
        const fetchBatches = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/batch/get-all-batches`);
                setBatches(res.data.data); // assuming your response has { data: [batches] }
            } catch (error) {
                console.error("Error fetching batches:", error);
            }
        };

        fetchBatches();
    }, []);
    const [formData, setFormData] = useState({
        title: '',
        contentType: 'video',
        batchId: '',
        email: '',
        content: null,
        textContent: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

    const handleSubmit = async (e) => {
        console.log(id)
        e.preventDefault();
        setLoading(true);
        setError('');

        const { title, contentType, batchId, email, content, textContent } = formData;
        const form = new FormData();
        form.append('title', title);
        form.append('contentType', contentType);
        form.append('batchId', batchId);
        form.append('email', email);
        if (contentType === 'text') {
            form.append('textContent', textContent);
        } else {
            form.append('content', content);
        }

        try {
            const response = await axios.post(`${BASE_URL}/batch/add-course/${id}`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Course added successfully!');
        } catch (err) {
            setError('Failed to add course. Please try again.');
            console.log(err)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-center mb-4">Add New Course</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Course Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="contentType" className="block text-sm font-medium text-gray-700">Content Type</label>
                    <select
                        id="contentType"
                        name="contentType"
                        value={formData.contentType}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        <option value="video">Video</option>
                        <option value="pdf">PDF</option>
                        <option value="text">Text</option>
                    </select>
                </div>

                {formData.contentType !== 'text' ? (
                    <div className="mb-4">
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">Upload Content</label>
                        <input
                            type="file"
                            id="content"
                            name="content"
                            onChange={handleFileChange}
                            required
                            className="mt-1 block w-full text-sm text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                ) : (
                    <div className="mb-4">
                        <label htmlFor="textContent" className="block text-sm font-medium text-gray-700">Text Content</label>
                        <textarea
                            id="textContent"
                            name="textContent"
                            value={formData.textContent}
                            onChange={handleTextChange}
                            required
                            rows="4"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                )}

                {/* <div className="mb-4">
                    <label htmlFor="batchId" className="block text-sm font-medium text-gray-700">Select Batch</label>
                    <select
                        id="batchId"
                        name="batchId"
                        value={formData.batchId}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        <option value="">--Select Batch--</option>
            {batches.map((batch) => (
              <option key={batch._id} value={batch._id}>{batch.title}</option>
            ))}
                    </select>
                </div> */}

                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Teacher's Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="mt-6">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                    >
                        {loading ? 'Uploading...' : 'Add Course'}
                        
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CourseUpload;
