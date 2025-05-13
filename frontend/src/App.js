import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  Outlet,
  Link,
} from "react-router-dom";
import Users from "./Views/Users";
import Departments from "./Views/Departments";
import Lectures from "./Views/Lectures";
import Courses from "./Views/Courses";
import Assignment from "./Views/Assignment";
import Home from "./Views/Home";
import Exams from "./Views/Exams";
import LoginPage from "./Views/LoginPage";
import RoleSelectPage from "./Views/RoleSelectPage";
import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute"; // ⬅ import this
import LogoutButton from "./components/LogoutButton"; // adjust path as needed

// 🧱 Layout with navigation bar for roles
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
       <LogoutButton/>
      </nav>
      <Outlet />
    </div>
  );
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<RoleSelectPage />} />
      <Route path="/login/:type" element={<LoginPage />} />

      {/* Admin Routes */}



      <Route path="/admins" element={
        <RoleLayout role="admins" />}>
        <Route path="courses" element={<ProtectedRoute allowedRoles={["admin"]}> <Courses /></ProtectedRoute>} />
        <Route path="users" element={<ProtectedRoute allowedRoles={["admin"]}> <Users /></ProtectedRoute>} /> 
        <Route path="departments" element={<ProtectedRoute allowedRoles={["admin"]}> <Departments /></ProtectedRoute>} />
        <Route path="lectures" element={ <ProtectedRoute allowedRoles={["admin"]}> <Lectures /></ProtectedRoute>} />
        <Route path="assignments" element={<ProtectedRoute allowedRoles={["admin"]}> <Assignment /></ProtectedRoute>} />
        <Route path="exams" element={<ProtectedRoute allowedRoles={["admin"]}> <Exams /></ProtectedRoute> } />
      </Route>

      {/* Teacher Routes */}
      <Route path="/teachers" element={<RoleLayout role="teachers" />}>
        <Route path="courses" element={<ProtectedRoute allowedRoles={["teacher"]}><Courses /></ProtectedRoute>} />
        <Route path="lectures" element={<ProtectedRoute allowedRoles={["teacher"]}><Lectures /></ProtectedRoute>} />
        <Route path="assignments" element={<ProtectedRoute allowedRoles={["teacher"]}> <Assignment /></ProtectedRoute>} />
        <Route path="exams" element={<ProtectedRoute allowedRoles={["teacher"]}><Exams /></ProtectedRoute>} />
      </Route>

      {/* Student Routes */}
      <Route path="/students" element={<RoleLayout role="students" />}>
        <Route path="courses" element={   <ProtectedRoute allowedRoles={["student"]}>
        <Courses />
      </ProtectedRoute>} />
        <Route path="assignments" element={   <ProtectedRoute allowedRoles={["student"]}>
        <Assignment />
      </ProtectedRoute>} />
        <Route path="exams" element={   <ProtectedRoute allowedRoles={["student"]}>
        <Courses />
      </ProtectedRoute>} />
      </Route>

      {/* Redirect old path /app to admin's view by default */}
      <Route path="/app/*" element={<Navigate to="/admins/courses" replace />} />
    </Routes>
  );
}

export default function WrappedApp() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
