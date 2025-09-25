import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useAuth } from "../context/authContext"; // uses your updated context

const RoleSelectPage = () => {
  const navigate = useNavigate();
  const { user, setAccessToken } = useAuth(); // user?.role from decoded token

  const go = (role) => {
    // already logged in with this role → straight to dashboard
    if (user?.role === role) {
      navigate(`/${role}s`);
    } else {
      // different role or not authed → go to that role’s login
      navigate(`/login/${role}`);
    }
  };

  // Try restoring via refresh cookie, then route. Fallback to login.
  const tryRestoreThenGo = async (role) => {
    // If already authed as same role, skip network
    if (user?.role === role) return navigate(`/${role}s`);
    try {
      const res = await fetch(`/api/auth/${role}s/refresh`, {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json(); // { accessToken }
        if (setAccessToken) setAccessToken(data.accessToken);
        return navigate(`/${role}s`);
      }
    } catch (_) {}
    go(role);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Sign in as</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Button onClick={() => tryRestoreThenGo("admin")}>Admin</Button>
          <Button onClick={() => tryRestoreThenGo("teacher")}>Teacher</Button>
          <Button onClick={() => tryRestoreThenGo("student")}>Student</Button>
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
