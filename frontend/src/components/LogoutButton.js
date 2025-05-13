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
    <Button width="100px"
      onClick={handleLogout}
      className="ml-4 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
