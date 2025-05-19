import React, { useEffect, useState } from "react";
import AllBatchCard from "../components/AllBatchCard"; // assuming in same folder
import BASE_URL from "../utils/utils";
import axios from "axios";
import Navbar from "../components/Navbar";
const AllBatches = () => {
  const [batches, setBatches] = useState([]);
  console.log(batches)
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const email = JSON.parse(localStorage.getItem('teacher'))
        console.log(email)
        const res = await axios.get(`${BASE_URL}/batch/get-all-batches`);
        setBatches(res.data.data); // assuming your response has { data: [batches] }
      } catch (error) {
        console.error("Error fetching batches:", error);
      }
    };

    fetchBatches();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
        <Navbar/>
        <br />
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        All Batches
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {batches.map((batch) => (
          <AllBatchCard key={batch._id} batch={batch} />
        ))}
      </div>
    </div>
  );
};

export default AllBatches;
