import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BASE_URL from '../../../Teacher/utils/utils.js';
import { FaVideo, FaFileAlt, FaFilePdf } from 'react-icons/fa';

export default function CoursesPage() {
  const { id } = useParams();
  const [courses, setCourses] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(true);

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
        setPdfs(res.data.pdfs); // backend should return { pdfs: [...] }
      } catch (error) {
        console.error('Error fetching PDFs:', error);
      } finally {
        setPdfLoading(false);
      }
    };

    fetchCourses();
    fetchPdfs();
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

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        📋 Course Materials
      </h1>

      {/* --- Courses --- */}
      {loading ? (
        <p className="text-center text-gray-500">Loading courses...</p>
      ) : courses.length === 0 ? (
        <p className="text-center text-gray-500">No courses available for this batch yet.</p>
      ) : (
        <ul className="space-y-4 mb-10">
          {courses.map((course) => (
            <li
              key={course._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex items-center justify-between hover:shadow-md transition"
            >
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
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition text-sm"
              >
                {course.contentType === 'video'
                  ? 'Watch Video'
                  : course.contentType === 'pdf'
                    ? 'Open PDF'
                    : 'View Content'}
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* --- PDF Only Uploads --- */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-12 text-center">📄 Additional PDFs</h2>
      {pdfLoading ? (
        <p className="text-center text-gray-500">Loading PDFs...</p>
      ) : pdfs.length === 0 ? (
        <p className="text-center text-gray-500">No additional PDFs uploaded yet.</p>
      ) : (
        <ul className="space-y-4">
          {pdfs.map((pdf) => (
            <li
              key={pdf._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex items-center justify-between hover:shadow-md transition"
            >
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
                onClick={() => window.open(`http://localhost:8000/${pdf.pdf}`, '_blank')}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition text-sm"
              >
                Open PDF
              </button>

            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
