import React, { useState, useEffect } from "react";
import { FiUsers, FiBook, FiBookOpen, FiClock, FiLogOut, FiMenu, FiX, FiSun, FiMoon } from "react-icons/fi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { format } from "date-fns";

const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    registrationDate: "2024-01-15",
    status: "Active",
    profilePic: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    registrationDate: "2024-01-10",
    status: "Blocked",
    profilePic: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
  }
];

const mockTeachers = [
  {
    id: 1,
    name: "Prof. Williams",
    department: "Computer Science",
    coursesTaught: ["Web Development", "Python Programming"],
    performance: 4.8,
    profilePic: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
  }
];

const mockCourses = [
  {
    id: 1,
    title: "Advanced Web Development",
    instructor: "Prof. Williams",
    duration: "12 weeks",
    enrollmentCount: 45,
    status: "Active"
  }
];

const mockPendingRequests = [
  {
    id: 1,
    type: "registration",
    requester: "Alex Johnson",
    date: "2024-01-20",
    status: "Pending"
  }
];

const AdminDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const isDark = localStorage.getItem("darkMode") === "true";
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", (!darkMode).toString());
    document.documentElement.classList.toggle("dark");
  };

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const renderContent = () => {
    switch (activeSection) {
      case "users":
        return (
          <div className="p-6">
            <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
              <input
                type="text"
                placeholder="Search users..."
                className="p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left">ID</th>
                    <th className="px-6 py-3 text-left">Name</th>
                    <th className="px-6 py-3 text-left">Email</th>
                    <th className="px-6 py-3 text-left">Registration Date</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="border-b dark:border-gray-700">
                      <td className="px-6 py-4">{user.id}</td>
                      <td className="px-6 py-4 flex items-center gap-2">
                        <img src={user.profilePic} alt={user.name} className="w-8 h-8 rounded-full" />
                        {user.name}
                      </td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">{format(new Date(user.registrationDate), "MMM dd, yyyy")}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-sm ${user.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200">
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "teachers":
        return (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTeachers.map(teacher => (
              <div key={teacher.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  <img src={teacher.profilePic} alt={teacher.name} className="w-16 h-16 rounded-full" />
                  <div>
                    <h3 className="text-lg font-semibold">{teacher.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{teacher.department}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Courses Taught:</h4>
                  <div className="flex flex-wrap gap-2">
                    {teacher.coursesTaught.map(course => (
                      <span key={course} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-sm">
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Performance: {teacher.performance}/5.0</span>
                  <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        );

      case "courses":
        return (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockCourses.map(course => (
              <div key={course.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Instructor: {course.instructor}</p>
                <div className="flex justify-between mb-4">
                  <span>Duration: {course.duration}</span>
                  <span>Students: {course.enrollmentCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-1 rounded-full text-sm ${course.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {course.status}
                  </span>
                  <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        );

      case "requests":
        return (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockPendingRequests.map(request => (
                <div key={request.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{request.requester}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{request.type} Request</p>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
                      {request.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Submitted: {format(new Date(request.date), "MMM dd, yyyy")}
                  </p>
                  <div className="flex gap-2">
                    <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                      Approve
                    </button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-2">Total Users</h3>
                <p className="text-3xl font-bold">{mockUsers.length}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-2">Total Teachers</h3>
                <p className="text-3xl font-bold">{mockTeachers.length}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-2">Total Courses</h3>
                <p className="text-3xl font-bold">{mockCourses.length}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-2">Pending Requests</h3>
                <p className="text-3xl font-bold">{mockPendingRequests.length}</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="flex bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? "w-64" : "w-20"} transition-all duration-300 bg-white dark:bg-gray-800 min-h-screen shadow-lg`}>
          <div className="p-4 flex justify-between items-center">
            <h1 className={`font-bold text-xl ${!sidebarOpen && "hidden"}`}>Admin Panel</h1>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
              {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
          <nav className="mt-8">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveSection("dashboard")}
                  className={`w-full p-4 flex items-center gap-4 hover:bg-gray-200 dark:hover:bg-gray-700 ${activeSection === "dashboard" ? "bg-gray-200 dark:bg-gray-700" : ""}`}
                >
                  <FiUsers size={24} />
                  {sidebarOpen && <span>Dashboard</span>}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection("users")}
                  className={`w-full p-4 flex items-center gap-4 hover:bg-gray-200 dark:hover:bg-gray-700 ${activeSection === "users" ? "bg-gray-200 dark:bg-gray-700" : ""}`}
                >
                  <FiUsers size={24} />
                  {sidebarOpen && <span>Users</span>}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection("teachers")}
                  className={`w-full p-4 flex items-center gap-4 hover:bg-gray-200 dark:hover:bg-gray-700 ${activeSection === "teachers" ? "bg-gray-200 dark:bg-gray-700" : ""}`}
                >
                  <FaChalkboardTeacher size={24} />
                  {sidebarOpen && <span>Teachers</span>}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection("courses")}
                  className={`w-full p-4 flex items-center gap-4 hover:bg-gray-200 dark:hover:bg-gray-700 ${activeSection === "courses" ? "bg-gray-200 dark:bg-gray-700" : ""}`}
                >
                  <FiBook size={24} />
                  {sidebarOpen && <span>Courses</span>}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection("requests")}
                  className={`w-full p-4 flex items-center gap-4 hover:bg-gray-200 dark:hover:bg-gray-700 ${activeSection === "requests" ? "bg-gray-200 dark:bg-gray-700" : ""}`}
                >
                  <FiClock size={24} />
                  {sidebarOpen && <span>Requests</span>}
                </button>
              </li>
              <li>
                <button
                  className="w-full p-4 flex items-center gap-4 hover:bg-gray-200 dark:hover:bg-gray-700 text-red-600 dark:text-red-400"
                >
                  <FiLogOut size={24} />
                  {sidebarOpen && <span>Logout</span>}
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <header className="bg-white dark:bg-gray-800 shadow-md">
            <div className="flex justify-between items-center p-4">
              <h2 className="text-xl font-semibold capitalize">{activeSection}</h2>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {darkMode ? <FiSun size={24} /> : <FiMoon size={24} />}
              </button>
            </div>
          </header>
          <main className="p-4">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
