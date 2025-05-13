import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

const RoleSelectPage = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    navigate(`/login/${role}`);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Sign in as</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Button onClick={() => handleRoleSelect("admin")}>Admin</Button>
          <Button onClick={() => handleRoleSelect("teacher")}>Teacher</Button>
          <Button onClick={() => handleRoleSelect("student")}>Student</Button>
        </div>
      </div>
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
  card: {
    backgroundColor: "#fff",
    padding: 40,
    borderRadius: 12,
    boxShadow: "0 8px 32px rgba(31, 38, 135, 0.1)",
    maxWidth: 400,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    textAlign: "center",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "12px",
    color: "#2d3748",
  },
};

export default RoleSelectPage;
