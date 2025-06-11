// ✅ StudentDashboard.js
import React, { useState } from "react";
import { UserCircle } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import "./AdminDashboard.css";

export default function StudentDashboard() {
  const [showLogout, setShowLogout] = useState(false);

  return (
    <div className="admin-container">
      <div className="admin-main">
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

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
