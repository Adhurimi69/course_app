import React, { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);          // decoded access token (claims)
  const [accessToken, setAccessTokenState] = useState(null);
  const [role, setRole] = useState(() => localStorage.getItem("role")); // "admin" | "teacher" | "student" | null
  const isAuthed = !!user;

  const decodeAndSet = (token) => {
    try {
      const decoded = jwtDecode(token);
      // optional: ignore obviously expired tokens
      if (decoded?.exp && Date.now() >= decoded.exp * 1000) {
        throw new Error("expired");
      }
      setUser(decoded);
      setAccessTokenState(token);
      return true;
    } catch {
      setUser(null);
      setAccessTokenState(null);
      return false;
    }
  };

  // Initial load: use stored token if valid, otherwise try cookie-based refresh (needs stored role).
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token && decodeAndSet(token)) return;

    const savedRole = localStorage.getItem("role");
    if (!savedRole) return;

    // Try restoring from refresh cookie (httpOnly) for the saved role.
    (async () => {
      try {
        const res = await fetch(`/api/auth/${savedRole}s/refresh`, {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json(); // { accessToken }
          localStorage.setItem("accessToken", data.accessToken);
          decodeAndSet(data.accessToken);
        } else {
          // cleanup if refresh failed
          localStorage.removeItem("accessToken");
          localStorage.removeItem("role");
          setRole(null);
        }
      } catch {
        // ignore network errors on boot
      }
    })();
  }, []);

  // === Public API ===

  // Keep original API, but allow passing role (optional) at login time.
  const login = (token, userRole) => {
    if (userRole) {
      setRole(userRole);
      localStorage.setItem("role", userRole);
    }
    localStorage.setItem("accessToken", token);
    decodeAndSet(token);
  };

  // Helper to update token after /refresh (used by interceptors/UI).
  const setAccessToken = (token) => {
    localStorage.setItem("accessToken", token);
    decodeAndSet(token);
  };

  const logout = async () => {
    try {
      const r = localStorage.getItem("role");
      if (r) {
        await fetch(`/api/auth/${r}s/logout`, {
          method: "POST",
          credentials: "include",
        });
      }
    } catch (_) {
      // best-effort; still clear client state
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    setUser(null);
    setAccessTokenState(null);
    setRole(null);
  };

  // Small helpers for axios/fetch layers
  const getAccessToken = () => accessToken;
  const getRole = () => role;

  return (
    <AuthContext.Provider
      value={{ user, login, logout, setAccessToken, getAccessToken, isAuthed, role, getRole }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Hook for convenience (unchanged)
export const useAuth = () => useContext(AuthContext);
