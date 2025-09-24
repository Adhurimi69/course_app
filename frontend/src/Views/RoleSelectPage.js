import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import "./Auth.css";

const RoleSelectPage = () => {
  const navigate = useNavigate();
  const { user, setAccessToken } = useAuth();

  const go = (role) => {
    if (user?.role === role) {
      navigate(`/${role}s`);
    } else {
      navigate(`/login/${role}`);
    }
  };

  const tryRestoreThenGo = async (role) => {
    if (user?.role === role) return navigate(`/${role}s`);
    try {
      const res = await fetch(`/api/auth/${role}s/refresh`, {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        if (setAccessToken) setAccessToken(data.accessToken);
        return navigate(`/${role}s`);
      }
    } catch (_) {}
    go(role);
  };

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        <h2>Sign in as</h2>
        <div className="role-options">
          <button onClick={() => tryRestoreThenGo("admin")}>Admin</button>
          <button onClick={() => tryRestoreThenGo("teacher")}>Teacher</button>
          <button onClick={() => tryRestoreThenGo("student")}>Student</button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectPage;
