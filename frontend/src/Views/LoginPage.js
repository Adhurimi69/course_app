import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Button from "../components/Button";

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const LoginPage = () => {
  const { type } = useParams(); // "admin", "teacher", or "student"
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  console.log("Submitting login with:", { email, password, userType: type });

  try {
    const response = await axios.post(
      `http://localhost:5000/api/auth/${type}s/login`,
      { email, password },
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );

    console.log("Login response:", response);

    const { accessToken } = response.data;

    if (!accessToken) {
      setError("Login failed: no access token received");
      console.warn("No access token received in response");
      return;
    }

    localStorage.setItem("accessToken", accessToken);
    console.log("Access token saved to localStorage");

    const decoded = jwtDecode(accessToken);
    console.log("Decoded JWT token:", decoded);

    const role = decoded?.role;

    if (["admin", "teacher", "student"].includes(role)) {
      console.log(`Navigating to /${role}s/courses`);
      navigate(`/${role}s/courses`);
    } else {
      console.warn("Role from token is unexpected, navigating to home");
      navigate("/");
    }
  } catch (error) {
    if (error.response?.data?.message) {
      setError(error.response.data.message);
      console.error("Backend error message:", error.response.data.message);
    } else {
      setError("Server error during login.");
      console.error("Unexpected login error:", error);
    }
  }
};


  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Sign in as {capitalize(type)}</h2>

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          placeholder="Email *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          placeholder="Password *"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ ...styles.input, ...styles.passwordHidden }}
        />

        {error && <p style={styles.error}>{error}</p>}

        <Button>Sign In</Button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: "1rem",
  },
  form: {
    backgroundColor: "#fff",
    padding: 40,
    borderRadius: 12,
    boxShadow: "0 8px 32px rgba(31, 38, 135, 0.1)",
    maxWidth: 400,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    border: "1px solid rgba(255, 255, 255, 0.2)",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "12px",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    fontSize: 14,
    color: "#2d3748",
    backgroundColor: "#f8fafc",
  },
  passwordHidden: {
    WebkitTextSecurity: "disc",
    textSecurity: "disc",
  },
  error: {
    color: "red",
    fontSize: "14px",
    textAlign: "center",
    marginTop: -10,
  },
};

export default LoginPage;
