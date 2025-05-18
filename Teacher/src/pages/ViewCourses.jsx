import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../utils/utils'; // Adjust path as needed

const ViewCourses = () => {
  const { id } = useParams();

  useEffect(() => {
    const viewCourses = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/batch/get-courses-by-batchid/${id}`);
        console.log(res.data.success);
        console.log(res.data.courses); // You can use this to show courses
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    viewCourses();
  }, [id]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">View Courses</h2>
      {/* You can map over course data here when ready */}
    </div>
  );
};

export default ViewCourses;
