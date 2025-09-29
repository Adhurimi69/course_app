import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "./Auth.css";

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const LoginPage = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/auth/${type}s/login`,
        { email, password },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );

      const { accessToken } = response.data;
      if (!accessToken) {
        setError("Login failed: no access token received");
        setLoading(false);
        return;
      }

      localStorage.setItem("accessToken", accessToken);
      const decoded = jwtDecode(accessToken);

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: decoded?.id,
          username: decoded?.username,
          role: decoded?.role,
        })
      );
      // Persist role so other components can read it from localStorage
      if (decoded?.role) localStorage.setItem('role', decoded.role);

      const role = decoded?.role;
      if (["admin", "teacher", "student"].includes(role)) {
        navigate(`/${role}s/courses`);
      } else {
        navigate("/");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Server error during login.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        <h2>Sign in as {capitalize(type)}</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            id="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="auth-link">
          Don’t have an account?{" "}
          <Link to="/signup">Create Account →</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
