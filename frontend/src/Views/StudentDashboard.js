import React, { useEffect, useState } from "react";
import { UserCircle } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import axios from "axios";
import "./AdminDashboard.css";
import { useLocation } from "react-router-dom";

export default function StudentDashboard() {
  const [showLogout, setShowLogout] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const studentId = JSON.parse(localStorage.getItem("user"))?.id;
const location = useLocation();
const isCoursePage = /^\/students\/courses\/\d+/.test(location.pathname);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const enrolledRes = await axios.get(
        `http://localhost:5000/api/commands/student-courses/enrolled/${studentId}`
      );
      const availableRes = await axios.get(
        `http://localhost:5000/api/commands/student-courses/available/${studentId}`
      );
      setEnrolledCourses(enrolledRes.data);
      setAvailableCourses(availableRes.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const enrollCourse = async (courseId) => {
    try {
      await axios.post("http://localhost:5000/api/commands/student-courses", {
        studentId,
        courseId,
      });
      fetchCourses(); // Refresh lists
    } catch (err) {
      console.error("Failed to enroll:", err);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-main">
        <header className="admin-navbar">
          <Link to="/" className="admin-home-link">Home</Link>
          <div className="relative">
            <UserCircle
              size={32}
              className="text-gray-500 cursor-pointer"
              onClick={() => setShowLogout((prev) => !prev)}
            />
            {showLogout && (
              <div className="absolute right-0 mt-2 bg-white border rounded shadow z-10">
                <LogoutButton />
              </div>
            )}
          </div>
        </header>

<main className="admin-content">
  <Outlet />
</main>

  
      </div>
    </div>
  );
}
