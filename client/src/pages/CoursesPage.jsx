import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BASE_URL from '../../../Teacher/src/utils/utils';
import { FaVideo, FaFileAlt, FaFilePdf } from 'react-icons/fa';

export default function CoursesPage() {
  const { id } = useParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const viewCourses = async () => {
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
    viewCourses();
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

      {loading ? (
        <p className="text-center text-gray-500">Loading courses...</p>
      ) : courses.length === 0 ? (
        <p className="text-center text-gray-500">No courses available for this batch yet.</p>
      ) : (
        <ul className="space-y-4">
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
                onClick={() => window.open(course.content.url, '_blank')}
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
    </div>
  );
}
