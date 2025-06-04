import React, { useState } from "react";
import { ChevronDown, ChevronUp, UserCircle } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import LogoutButton from "../components/LogoutButton"; // ✅ Adjust the path if needed
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false); // 👈 for logout toggle

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">Admin Panel</div>
        <nav className="admin-nav">
          <ul className="space-y-2">
            <li>
              <Link to="/admins/users" className="admin-link">
                Users
              </Link>
            </li>
            <li>
              <Link to="/admins/departments" className="admin-link">
                Departments
              </Link>
            </li>
            <li>
              <button
                onClick={() => setIsCoursesOpen(!isCoursesOpen)}
                className="admin-collapsible-button"
              >
                <span>Courses</span>
                {isCoursesOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {isCoursesOpen && (
                <ul className="ml-4 mt-1 space-y-1 text-sm">
                  <li>
                    <Link to="/admins/courses" className="admin-subitem">
                      Courses
                    </Link>
                  </li>
                  <li>
                    <Link to="/admins/lectures" className="admin-subitem">
                      Lectures
                    </Link>
                  </li>
                  <li>
                    <Link to="/admins/assignments" className="admin-subitem">
                      Assignments
                    </Link>
                  </li>
                  <li>
                    <Link to="/admins/exams" className="admin-subitem">
                      Exams
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main">
        {/* Navbar */}
        <header className="admin-navbar">
          <Link to="/" className="admin-home-link">
            Home
          </Link>

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

        {/* Content */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
