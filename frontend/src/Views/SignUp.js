import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.css";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    await axios.post(
      "http://localhost:5000/api/commands/students",
      formData,
      { headers: { "Content-Type": "application/json" } }
    );

    alert("Account created! Redirecting to dashboard...");
    navigate("/");
  } catch (error) {
    if (error.response?.data?.message) {
      alert("Signup failed: " + error.response.data.message);
    } else {
      alert("Signup failed: " + error.message);
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="auth-wrapper">
      <h2>Create Your Account</h2>
      <form className="auth-form" onSubmit={handleSignup}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          required
          value={formData.name}
          onChange={handleChange}
          disabled={loading}
        />
        <input
          type="email"
          name="email"
          placeholder="Email address"
          required
          value={formData.email}
          onChange={handleChange}
          disabled={loading}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={handleChange}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>

      <p style={{ marginTop: "20px" }}>
        Already have an account?{" "}
        <Link to="/login" style={{ color: "#6c63ff" }}>
          Sign In →
        </Link>
      </p>
    </div>
  );
}

export default Signup;
