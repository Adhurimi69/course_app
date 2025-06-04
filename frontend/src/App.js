import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./Views/LoginPage";
import RoleSelectPage from "./Views/RoleSelectPage";
import Home from "./Views/Home";
import Courses from "./Views/Courses";
import Users from "./Views/Users";
import Departments from "./Views/Departments";
import Lectures from "./Views/Lectures";
import Assignment from "./Views/Assignment";
import Exams from "./Views/Exams";
import Blog from "./Views/Blog";
import Prices from "./Views/Prices";
import Signup from "./Views/SignUp";
import { Link } from "react-router-dom";
import AdminDashboard from "./Views/AdminDashboard";
import LogoutButton from "./components/LogoutButton";

const RoleLayout = ({ role }) => {
  return (
    <div className="App">
      <h1 className="title">Course Management System</h1>
      <nav className="nav-bar">
        <Link to={`/${role}/courses`}>Courses</Link>
        <Link to={`/${role}/users`}>Users</Link>
        <Link to={`/${role}/departments`}>Departments</Link>
        <Link to={`/${role}/lectures`}>Lectures</Link>
        <Link to={`/${role}/assignments`}>Assignments</Link>
        <Link to={`/${role}/exams`}>Exams</Link>
      </nav>
      <Outlet />
    </div>
  );
};
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<RoleSelectPage />} />
      <Route path="/login/:type" element={<LoginPage />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/prices" element={<Prices />} />
      <Route path="/signup" element={<Signup />} />
      

      <Route
        path="/admins"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      >
        {/* ✅ Add a default welcome route */}
        <Route index element={<div style={{ padding: "1rem" }}>Welcome to the Admin Dashboard</div>} />

        <Route path="courses" element={<Courses />} />
        <Route path="users" element={<Users />} />
        <Route path="departments" element={<Departments />} />
        <Route path="lectures" element={<Lectures />} />
        <Route path="assignments" element={<Assignment />} />
        <Route path="exams" element={<Exams />} />
      </Route>



      <Route path="/teachers" element={<RoleLayout role="teachers" />}>
        <Route index element={<Navigate to="courses" replace />} />
        <Route path="courses" element={<ProtectedRoute allowedRoles={["teacher"]}><Courses /></ProtectedRoute>} />
        <Route path="lectures" element={<ProtectedRoute allowedRoles={["teacher"]}><Lectures /></ProtectedRoute>} />
        <Route path="assignments" element={<ProtectedRoute allowedRoles={["teacher"]}><Assignment /></ProtectedRoute>} />
        <Route path="exams" element={<ProtectedRoute allowedRoles={["teacher"]}><Exams /></ProtectedRoute>} />
      </Route>

      <Route path="/students" element={<RoleLayout role="students" />}>
        <Route index element={<Navigate to="courses" replace />} />
        <Route path="courses" element={<ProtectedRoute allowedRoles={["student"]}><Courses /></ProtectedRoute>} />
        <Route path="assignments" element={<ProtectedRoute allowedRoles={["student"]}><Assignment /></ProtectedRoute>} />
        <Route path="exams" element={<ProtectedRoute allowedRoles={["student"]}><Exams /></ProtectedRoute>} />
      </Route>

      <Route path="/app/*" element={<Navigate to="/admins/courses" replace />} />
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
}

export default App;
