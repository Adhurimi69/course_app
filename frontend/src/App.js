// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Users from './Views/Users';
import Departments from './Views/Departments';
import Lectures from './Views/Lectures';
import Courses from './Views/Courses';
import Home from './Views/Home';
import './App.css';

function App() {
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
        <Route path="/app" element={<Courses />} />
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
