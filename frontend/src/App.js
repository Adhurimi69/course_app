// src/App.js
import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./Views/Home";
import RoleSelectPage from "./Views/RoleSelectPage";
import LoginPage from "./Views/LoginPage";
import Signup from "./Views/SignUp";
import Blog from "./Views/Blog";
import Prices from "./Views/Prices";
import AboutUs from "./Views/AboutUs";

import AdminDashboard from "./Views/AdminDashboard";
import Users from "./Views/Users";
import Departments from "./Views/Departments";
import Lectures from "./Views/Lectures";
import Assignment from "./Views/Assignment";
import Exams from "./Views/Exams";
import Courses from "./Views/Courses";
import TeacherDashboard from "./Views/TeacherDashboard";
import CourseLayout from "./components/CourseLayout";

function RoleLayout({ role }) {
  return (
    <div className="App">
      <h1 className="title">Course Management System</h1>
      <nav className="nav-bar">
        <a href={`/${role}/courses`}>Courses</a>
        <a href={`/${role}/users`}>Users</a>
        <a href={`/${role}/departments`}>Departments</a>
        <a href={`/${role}/lectures`}>Lectures</a>
        <a href={`/${role}/assignments`}>Assignments</a>
        <a href={`/${role}/exams`}>Exams</a>
      </nav>
      <Outlet />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<RoleSelectPage />} />
      <Route path="/login/:type" element={<LoginPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/prices" element={<Prices />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/about" element={<AboutUs />} />

      {/* Admin routes */}
      <Route
        path="/admins"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={
            <div style={{ padding: "1rem" }}>
              Welcome to the Admin Dashboard
            </div>
          }
        />
        <Route path="courses" element={<Courses />} />
        <Route path="courses/:id" element={<Courses />} />

        <Route path="users" element={<Users />} />
        <Route path="users/:id" element={<Users />} />

        <Route path="departments" element={<Departments />} />
        <Route path="departments/:id" element={<Departments />} />

        <Route path="lectures" element={<Lectures />} />
        <Route path="lectures/:id" element={<Lectures />} />

        <Route path="assignments" element={<Assignment />} />
        <Route path="assignments/:id" element={<Assignment />} />

        <Route path="exams" element={<Exams />} />
        <Route path="exams/:id" element={<Exams />} />
      </Route>

      {/* Teacher routes */}
      <Route
        path="/teachers"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      >
        {/* Redirect /teachers to courses list */}
        <Route index element={<Navigate to="courses" replace />} />

        {/* Courses list and nested detail */}
        <Route path="courses">
          {/* List view as cards */}
          <Route
            index
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <Courses teacherView />
              </ProtectedRoute>
            }
          />

          {/* Course detail with tabs */}
          <Route
            path=":courseId"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <CourseLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="lectures" replace />} />
            <Route path="lectures" element={<Lectures />} />
            <Route path="assignments" element={<Assignment />} />
            <Route path="exams" element={<Exams />} />
          </Route>
        </Route>
      </Route>

      {/* Student routes */}
      <Route path="/students" element={<RoleLayout role="students" />}>
        <Route index element={<Navigate to="courses" replace />} />
        <Route
          path="courses"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Courses />
            </ProtectedRoute>
          }
        />
        <Route
          path="assignments"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Assignment />
            </ProtectedRoute>
          }
        />
        <Route
          path="exams"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Exams />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
}
