// src/components/Navbar.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Views/Home.css"; 

function Navbar() {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(true);

  const handleCreateAccount = () => {
    navigate("/signup");
  };

  return (
    <div className="navbar-wrapper">
      {/* Dismissible promotional alert */}
      {showAlert && (
        <div className="cta-alert">
          <span>🎉 Sign up now and get 25% off your first course!</span>
          <button
            className="close-alert"
            onClick={() => setShowAlert(false)}
          >
            ✖
          </button>
        </div>
      )}

      <nav className="navbar">
        <div className="logo">🧠 edunity</div>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/">Courses</Link></li>
          <li><Link to="/prices">Prices</Link></li>
          <li><Link to="/blog">Blog</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
        <button className="create-account" onClick={handleCreateAccount}>
          Create Account
        </button>
      </nav>
    </div>
  );
}

export default Navbar;
