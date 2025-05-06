import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import './App.css';
import Users from './Views/Users';
import Departments from './Views/Departments'; // ✅ Import i komponentit të ri

function App() {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const res = await axios.get('http://localhost:5000/api/courses');
    setCourses(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`http://localhost:5000/api/courses/${editingId}`, { title });
      setEditingId(null);
    } else {
      await axios.post('http://localhost:5000/api/courses', { title });
    }
    setTitle('');
    fetchCourses();
  };

  const handleEdit = (course) => {
    setEditingId(course.id);
    setTitle(course.title);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      await axios.delete(`http://localhost:5000/api/courses/${id}`);
      fetchCourses();
    }
  };

  return (
    <Router>
      <div className="App">
        <h1 className="title">Course Management System</h1>

        <nav>
          <Link to="/">Courses</Link> | <Link to="/users">Users</Link> | <Link to="/departments">Departments</Link>
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <>
                <form className="form" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder="Course Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="input"
                  />
                  <button type="submit" className="button submit-button">
                    {editingId ? 'Update Course' : 'Add Course'}
                  </button>
                </form>

                <h2 className="courses-title">Courses List</h2>
                <ul className="courses-list">
                  {courses.map((course) => (
                    <li key={course.id} className="course-item">
                      <div className="course-content">
                        <h3 className="course-title">{course.title}</h3>
                      </div>
                      <div className="course-actions">
                        <button onClick={() => handleEdit(course)} className="button edit-button">Edit</button>
                        <button onClick={() => handleDelete(course.id)} className="button delete-button">Delete</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            }
          />
          <Route path="/users" element={<Users />} />
          <Route path="/departments" element={<Departments />} /> {/* ✅ Rruga e re për departments */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
