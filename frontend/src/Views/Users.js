import React, { useEffect, useState } from "react";
import axios from "axios";

function Users() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingRole, setEditingRole] = useState(null);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const [adminsRes, teachersRes, studentsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/queries/admins"),
        axios.get("http://localhost:5000/api/queries/teachers"),
        axios.get("http://localhost:5000/api/queries/students"),
      ]);

      const admins = adminsRes.data.map((u) => ({
        ...u,
        role: "admin",
        id: u.adminId,
      }));
      const teachers = teachersRes.data.map((u) => ({
        ...u,
        role: "teacher",
        id: u.teacherId,
      }));
      const students = studentsRes.data.map((u) => ({
        ...u,
        role: "student",
        id: u.studentId,
      }));

      setUsers([...admins, ...teachers, ...students]);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let userData = { name, email };
    if (!editingId || password) {
      userData.password = password;
    }

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/commands/${editingRole}s/${editingId}`,
          userData
        );
      } else {
        if (!["admin", "teacher", "student"].includes(role)) {
          alert("Role must be 'admin', 'teacher', or 'student'");
          return;
        }
        await axios.post(`http://localhost:5000/api/commands/${role}s`, userData);
      }

      // Reset form
      setEditingId(null);
      setEditingRole(null);
      setName("");
      setEmail("");
      setRole("");
      setPassword("");
      fetchAllUsers();
    } catch (error) {
      console.error("Error submitting user:", error);
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setEditingRole(user.role);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setPassword("");
  };

  const handleDelete = async (id, role) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:5000/api/commands/${role}s/${id}`);
        fetchAllUsers();
      } catch (error) {
        console.error("Error deleting user:", error.response?.data || error.message);
      }
    }
  };

  return (
    <div className="Users">
      <h1 className="title">User Management</h1>

      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="User Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="input"
        />
        <input
          type="email"
          placeholder="User Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required={!editingId}
          className="input"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          className="input"
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
        </select>
        <button type="submit" className="button">
          {editingId ? "Update User" : "Add User"}
        </button>
      </form>

      <h2 className="users-title">Users List</h2>
      <table className="user-table" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}>#</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Role</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr
              key={`${user.role}-${user.id}`}
              style={index % 2 === 0 ? rowStyleEven : rowStyleOdd}
            >
              <td style={tdStyle}>{index + 1}</td>
              <td style={tdStyle}>{user.name}</td>
              <td style={tdStyle}>{user.email}</td>
              <td style={tdStyle}>{user.role}</td>
              <td style={tdStyle}>
                <button
                  onClick={() => handleEdit(user)}
                  className="button edit-button"
                  style={editBtn}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id, user.role)}
                  className="button delete-button"
                  style={deleteBtn}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Inline styles
const thStyle = {
  padding: "10px",
  backgroundColor: "#f4f4f4",
  borderBottom: "2px solid #ccc",
};
const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid #eee",
  textAlign: "left",
};
const rowStyleEven = { backgroundColor: "#fff" };
const rowStyleOdd = { backgroundColor: "#f9f9f9" };
const editBtn = {
  marginRight: "8px",
  padding: "5px 10px",
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  borderRadius: "4px",
};
const deleteBtn = {
  padding: "5px 10px",
  backgroundColor: "#f44336",
  color: "white",
  border: "none",
  borderRadius: "4px",
};

export default Users;
