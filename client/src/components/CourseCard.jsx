import React from 'react';
import { FaVideo, FaFileAlt, FaFilePdf } from 'react-icons/fa';

const CourseCard = ({ course }) => {
  const renderIcon = () => {
    switch (course.contentType) {
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 transition-all duration-300 hover:shadow-md w-full max-w-md mx-auto mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{course.title}</h3>
        <div className="text-xl">{renderIcon()}</div>
      </div>

      {/* Content Preview */}
      <div className="mb-4">
        {course.contentType === 'video' ? (
          <video
            src={course.content?.url}
            controls
            className="w-full h-48 rounded-lg object-cover"
          />
        ) : course.contentType === 'pdf' ? (
          <a
            href={course.content?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 underline hover:text-blue-800"
          >
            📄 View PDF
          </a>
        ) : (
          <iframe
            src={course.content?.url}
            title="Text Content"
            className="w-full h-40 border rounded-lg"
          ></iframe>
        )}
      </div>

      {/* Footer Info */}
      <div className="text-xs text-gray-500 mt-2">
        <p><strong>Batch:</strong> {course.batch?.title || 'N/A'}</p>
        <p><strong>Created By:</strong> {course.createdBy?.email || 'Unknown'}</p>
        <p><strong>Created At:</strong> {new Date(course.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default CourseCard;
