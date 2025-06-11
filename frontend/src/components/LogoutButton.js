import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button"
const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <Button
      width="100%"
      onClick={handleLogout}
      className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-all"
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
