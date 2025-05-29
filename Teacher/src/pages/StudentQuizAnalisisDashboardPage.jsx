import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BASE_URL from '../utils/utils';

const StudentQuizAnalisisDashboardPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
    const {id} = useParams()
  const fetchQuizResults = async () => {
    try {
        
      const res = await axios.get(`${BASE_URL}/batch/get-quiz-result-by-id/${id}`);
      console.log(res.data)
      setResults(res.data.results);
    } catch (err) {
      console.error('Error fetching quiz results:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizResults();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Student Quiz Performance</h1>

      {loading ? (
        <p>Loading...</p>
      ) : results.length === 0 ? (
        <p>No quiz results available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="py-2 px-4 text-left">Student Email</th>
                <th className="py-2 px-4 text-left">Quiz Title</th>
                <th className="py-2 px-4 text-center">Score</th>
                <th className="py-2 px-4 text-center">Total</th>
                <th className="py-2 px-4 text-center">Percentage</th>
                <th className="py-2 px-4 text-center">Submitted On</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => {
                const percentage = ((result.score / result.total) * 100).toFixed(2);
                const date = new Date(result.createdAt).toLocaleString();
                return (
                  <tr key={result._id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{result.student.email}</td>
                    <td className="py-2 px-4">{result.quiz.title}</td>
                    <td className="py-2 px-4 text-center">{result.score}</td>
                    <td className="py-2 px-4 text-center">{result.total}</td>
                    <td className="py-2 px-4 text-center">{percentage}%</td>
                    <td className="py-2 px-4 text-center">{date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentQuizAnalisisDashboardPage;
