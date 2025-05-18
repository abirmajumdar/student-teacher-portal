import React from "react";
import BatchCard from "./BatchCard"; // assuming in same folder

const dummyBatches = [
  {
    id: "1",
    title: "Full Stack Web Development",
    description: "Learn MERN stack in 12 weeks with live mentorship.",
    startDate: "June 1, 2025",
  },
  {
    id: "2",
    title: "DSA & System Design",
    description: "Master Data Structures and ace interviews.",
    startDate: "July 10, 2025",
  },
  {
    id: "3",
    title: "Frontend with React",
    description: "Build real-world apps using React and Tailwind.",
    startDate: "June 20, 2025",
  },
];

const BatchList = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Explore Batches
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {dummyBatches.map((batch) => (
          <BatchCard key={batch.id} batch={batch} />
        ))}
      </div>
    </div>
  );
};

export default BatchList;
