import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Users from './Views/Users';
import Departments from './Views/Departments';
import Lectures from './Views/Lectures';
import Home from './Views/Home';
import './App.css';

function App() {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [title, setTitle] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCourses();
    fetchDepartments();
  }, []);

  const fetchCourses = async () => {
    const res = await axios.get('http://localhost:5000/api/courses');
    setCourses(res.data);
  };

  const fetchDepartments = async () => {
    const res = await axios.get('http://localhost:5000/api/departments');
    setDepartments(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!departmentId) {
      alert('Please select a department.');
      return;
    }

    const data = { title, departmentId };

    if (editingId) {
      await axios.put(`http://localhost:5000/api/courses/${editingId}`, data);
      setEditingId(null);
    } else {
      await axios.post('http://localhost:5000/api/courses', data);
    }

    setTitle('');
    setDepartmentId('');
    fetchCourses();
  };

  const handleEdit = (course) => {
    setEditingId(course.id);
    setTitle(course.title);
    setDepartmentId(course.departmentId || '');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      await axios.delete(`http://localhost:5000/api/courses/${id}`);
      fetchCourses();
    }
  };

  return (
    <div className="App">
      <h1 className="title">Course Management System</h1>

      <nav className="nav-bar">
        <Link to="/app">Courses</Link>
        <Link to="/app/users">Users</Link>
        <Link to="/app/departments">Departments</Link>
        <Link to="/app/lectures">Lectures</Link>
      </nav>

      <Routes>
        <Route
          path="/app"
          element={
            <div className="course-page container">
              <form onSubmit={handleSubmit} className="course-form">
                <input
                  type="text"
                  placeholder="Course Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <select
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  required
                >
                  <option value="">-- Select Department --</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                <button type="submit">{editingId ? 'Update' : 'Add'} Course</button>
              </form>

              <ul className="course-list">
                {courses.map((course) => (
                  <li key={course.id}>
                    {course.title} - Dept ID: {course.departmentId || 'N/A'}
                    <button onClick={() => handleEdit(course)}>Edit</button>
                    <button onClick={() => handleDelete(course.id)}>Delete</button>
                  </li>
                ))}
              </ul>
            </div>
          }
        />
        <Route path="/app/users" element={<Users />} />
        <Route path="/app/departments" element={<Departments />} />
        <Route path="/app/lectures" element={<Lectures />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}
