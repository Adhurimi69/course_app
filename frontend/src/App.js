// src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./Views/Home";
import RoleSelectPage from "./Views/RoleSelectPage";
import LoginPage from "./Views/LoginPage";
import Signup from "./Views/SignUp";
import Blog from "./Views/Blog";
import Prices from "./Views/Prices";
import AboutUs from "./Views/AboutUs";
import ContactUs from "./Views/ContactUs";
import Courses1 from "./Views/Courses1"

import AdminDashboard from "./Views/AdminDashboard";
import Users from "./Views/Users";
import Departments from "./Views/Departments";
import Lectures from "./Views/Lectures";
import Assignment from "./Views/Assignment";
import Exams from "./Views/Exams";
import Courses from "./Views/Courses";
import TeacherDashboard from "./Views/TeacherDashboard";
import StudentDashboard from "./Views/StudentDashboard";
import StudentCoursesHome from "./Views/StudentCoursesHome";
import CourseLayout from "./components/CourseLayout";
import AssignmentSubmissions from './Views/AssignmentSubmissions';
import ExamSubmissions from './Views/ExamSubmissions';
import StudentAssignments from './Views/StudentAssignments';
import StudentExams from './Views/StudentExams';

// RoleLayout removed (not used)

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
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/courses1" element={<Courses1 />} />

      {/* ✅ Friendly alias used by pricing CTAs */}
      <Route path="/talk-to-an-advisor" element={<ContactUs />} />

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
          element={<div style={{ padding: "1rem" }}>Welcome to the Admin Dashboard</div>}
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
        <Route index element={<Navigate to="courses" replace />} />
        <Route path="courses">
          <Route
            index
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <Courses teacherView />
              </ProtectedRoute>
            }
          />
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
            <Route path="assignments/submissions" element={<AssignmentSubmissions />} />
            <Route path="exams" element={<Exams />} />
            <Route path="exams/submissions" element={<ExamSubmissions />} />
          </Route>
        </Route>
      </Route>

      {/* Student routes */}
      <Route
        path="/students"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentCoursesHome />} />
        <Route
          path="courses"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Courses studentView />
            </ProtectedRoute>
          }
        />
        <Route
          path="courses/:courseId"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <CourseLayout studentView />
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
        <Route path="assignments/list" element={<ProtectedRoute allowedRoles={["student"]}><StudentAssignments/></ProtectedRoute>} />
        <Route
          path="exams"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Exams />
            </ProtectedRoute>
          }
        />
        <Route path="exams/list" element={<ProtectedRoute allowedRoles={["student"]}><StudentExams/></ProtectedRoute>} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
}
