import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
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

    try {
      const response = await fetch(`http://localhost:5000/api/auth/${type}s/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        let message = "Login failed";
        if (contentType?.includes("application/json")) {
          const data = await response.json();
          message = data.message || message;
        }
        setError(message);
        return;
      }

      const { accessToken } = await response.json();
      localStorage.setItem("accessToken", accessToken);

      const decoded = jwtDecode(accessToken);
      const role = decoded?.role;

      if (["admin", "teacher", "student"].includes(role)) {
        navigate(`/${role}s/courses`);
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error during login.");
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
