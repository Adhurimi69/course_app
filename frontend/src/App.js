import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import Users from "./Views/Users";
import Departments from "./Views/Departments";
import Lectures from "./Views/Lectures";
import Courses from "./Views/Courses";
import Assignment from "./Views/Assignment";
import Home from "./Views/Home";
import Exams from "./Views/Exams";
import "./App.css";
import LoginPage from "./Views/LoginPage";
import Blog from "./Views/Blog";
import Prices from "./Views/Prices";

function App() {
  const location = useLocation();
  const isSimplePage = ["/", "/blog", "/login", "/prices"].includes(location.pathname);

  return (
    <div className="App">
      {!isSimplePage && <h1 className="title">Course Management System</h1>}

      {!isSimplePage && (
        <nav className="nav-bar">
          <Link to="/app">Courses</Link>
          <Link to="/app/users">Users</Link>
          <Link to="/app/departments">Departments</Link>
          <Link to="/app/lectures">Lectures</Link>
          <Link to="/app/assignments">Assignments</Link>
          <Link to="/app/exams">Exams</Link>
        </nav>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/app" element={<Courses />} />
        <Route path="/app/users" element={<Users />} />
        <Route path="/app/departments" element={<Departments />} />
        <Route path="/app/lectures" element={<Lectures />} />
        <Route path="/app/assignments" element={<Assignment />} />
        <Route path="/app/exams" element={<Exams />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/prices" element={<Prices />} />
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
