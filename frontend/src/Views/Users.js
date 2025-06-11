import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";

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
        id: u.studentId || u.id || u._id,
      }));

      setUsers([...admins, ...teachers, ...students]);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to fetch users.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || (!editingId && !password) || !role) {
      alert("Please fill in all required fields.");
      return;
    }

    const userData = {
      name,
      email,
      role,
      ...(password && { password }),
    };

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/commands/${editingRole}s/${editingId}`,
          userData
        );
        alert("User updated successfully.");
      } else {
        await axios.post(
          `http://localhost:5000/api/commands/${role}s`,
          userData
        );
        alert("User created successfully.");
      }

      setEditingId(null);
      setEditingRole(null);
      setName("");
      setEmail("");
      setPassword("");
      setRole("");
      fetchAllUsers();
    } catch (error) {
      console.error("Error submitting user:", error);
      alert("Error: " + (error.response ? JSON.stringify(error.response.data) : error.message));
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
        alert("User deleted successfully.");
        fetchAllUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user.");
      }
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "secondary";
      case "teacher":
        return "info";
      case "student":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          flexWrap: "wrap",
          mb: 4,
          backgroundColor: "#f9ecf9", // matches the table header
          p: 3,
          borderRadius: 2,
          boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <TextField
          label="User Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          size="small"
          sx={{
            minWidth: 160,
            backgroundColor: "#fff",
            borderRadius: 1,
          }}
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          size="small"
          sx={{
            minWidth: 180,
            backgroundColor: "#fff",
            borderRadius: 1,
          }}
        />
        <TextField
          label={editingId ? "New Password" : "Password"}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required={!editingId}
          size="small"
          sx={{
            minWidth: 160,
            backgroundColor: "#fff",
            borderRadius: 1,
          }}
        />
        <Select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          displayEmpty
          size="small"
          required
          sx={{
            minWidth: 140,
            backgroundColor: "#fff",
            borderRadius: 1,
          }}
        >
          <MenuItem value="">
            <em>Select Role</em>
          </MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="teacher">Teacher</MenuItem>
          <MenuItem value="student">Student</MenuItem>
        </Select>
        <Button
          variant="contained"
          color="secondary"
          type="submit"
          size="small"
          sx={{ whiteSpace: "nowrap" }}
        >
          {editingId ? "Update User" : "Add User"}
        </Button>
      </Box>



      <Typography variant="h5" gutterBottom>
        Users List
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f3e5f5" }}>
            <TableRow>
              <TableCell><strong>#</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Role</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((user, index) => (
              <TableRow key={`${user.role}-${user.id}`}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={user.role}
                    color={getRoleColor(user.role)}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(user.id, user.role)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Users;
