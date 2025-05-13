import React from "react";

const Button = ({ children, width = "100%", height = "auto", ...props }) => {
  return (
    <button
      style={{
        width,
        height,
        padding: "14px",
        backgroundColor: "#5b67ca",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "500",
        cursor: "pointer",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
        transition: "all 0.3s ease",
      }}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#4c51bf")}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#5b67ca")}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
