import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import BASE_URL from '../utils/utils';

const AllAssignmentPage = () => {
  const { id } = useParams(); // ID from URL
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/batch/get-all-assignment-submission-by-id/${id}`);
        setSubmissions(res.data.submissions);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [id]);
  const gradeSubmission = async (submissionId, marks) => {
    try {
      const res = await fetch(`http://localhost:8000/batch/submissions/${submissionId}/grade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ marks }),
      });

      const data = await res.json();

      if (res.ok) {
        // Update the submission in the local state
        setSubmissions((prev) =>
          prev.map((sub) =>
            sub._id === submissionId ? { ...sub, marks: data.submission.marks, status: data.submission.status } : sub
          )
        );
      } else {
        alert(data.message || 'Failed to grade.');
      }
    } catch (error) {
      console.error('Error grading submission:', error);
      alert('Error grading submission');
    }
  };

  if (loading) return <div className="text-center p-5">Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Submitted Assignments</h1>
        {submissions.length === 0 ? (
          <p>No submissions found.</p>
        ) : (
          <table className="w-full border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border px-3 py-2">#</th>
                <th className="border px-3 py-2">Student Email</th>
                <th className="border px-3 py-2">Submitted At</th>
                <th className="border px-3 py-2">Marks</th>
                <th className="border px-3 py-2">Status</th>
                <th className="border px-3 py-2">PDF</th>
              </tr>
            </thead>
            <tbody>
              {/* {submissions.map((submission, index) => (
              <tr key={submission._id} className="hover:bg-gray-50">
                <td className="border px-3 py-2">{index + 1}</td>
                <td className="border px-3 py-2">{submission.student?.email || "N/A"}</td>
                <td className="border px-3 py-2">
                  {new Date(submission.submittedAt).toLocaleString()}
                </td>
                <td className="border px-3 py-2">{submission.marks ?? "Not graded"}</td>
                <td className="border px-3 py-2 capitalize">{submission.status}</td>
                <td className="border px-3 py-2">
                  <a
                    href={`http://localhost:8000/${submission.pdf.replace(/\\/g, '/')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View PDF
                  </a>
                </td>
              </tr>
            ))} */}
              {submissions.map((submission, index) => (
                <tr key={submission._id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{index + 1}</td>
                  <td className="border px-3 py-2">{submission.student?.email || "N/A"}</td>
                  <td className="border px-3 py-2">{new Date(submission.submittedAt).toLocaleString()}</td>
                  <td className="border px-3 py-2">
                    {submission.status === 'graded' ? (
                      submission.marks
                    ) : (
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          min={0}
                          placeholder="Enter marks"
                          className="w-20 px-1 border rounded"
                          onChange={(e) => submission.tempMarks = e.target.value} // temp state for this row
                        />
                        <button
                          onClick={() => gradeSubmission(submission._id, Number(submission.tempMarks))}
                          className="bg-blue-500 text-white px-2 py-1 rounded"
                        >
                          Grade
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="border px-3 py-2 capitalize">{submission.status}</td>
                  <td className="border px-3 py-2">
                    <a
                      href={`http://localhost:8000/${submission.pdf.replace(/\\/g, '/')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View PDF
                    </a>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default AllAssignmentPage;
