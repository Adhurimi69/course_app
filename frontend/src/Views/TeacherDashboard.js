import React, { useState } from "react";
import { ChevronDown, ChevronUp, UserCircle } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import LogoutButton from "../components/LogoutButton"; // ✅ Adjust the path if needed
import "./AdminDashboard.css";

export default function TeacherDashboard() {
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false); // 👈 for logout toggle

  return (
    <div className="admin-container">
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
