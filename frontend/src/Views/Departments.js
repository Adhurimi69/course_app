// src/Views/Departments.js
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
} from "@mui/material";

function Departments() {
  const location = useLocation();
  const highlightId = location.state?.highlightId;

  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const departmentRefs = useRef({});

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (highlightId && departmentRefs.current[highlightId]) {
      departmentRefs.current[highlightId].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      departmentRefs.current[highlightId].style.backgroundColor = "#fff3cd"; // soft highlight
      const timer = setTimeout(() => {
        if (departmentRefs.current[highlightId]) {
          departmentRefs.current[highlightId].style.backgroundColor = "inherit";
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightId, departments]);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/queries/departments");
      setDepartments(res.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/commands/departments/${editingId}`, { name });
        setEditingId(null);
      } else {
        await axios.post("http://localhost:5000/api/commands/departments", { name });
      }
      setName("");
      fetchDepartments();
    } catch (error) {
      alert(error.response?.data?.error || "Error occurred");
    }
  };

  const handleEdit = (department) => {
    setEditingId(department.departmentId);
    setName(department.name);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await axios.delete(`http://localhost:5000/api/commands/departments/${id}`);
        fetchDepartments();
      } catch (error) {
        console.error("Error deleting department:", error);
      }
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Department Management
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", gap: 2, mb: 3 }}
      >
        <TextField
          label="Department Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
        />
        <Button variant="contained" color="secondary" type="submit">
          {editingId ? "Update" : "Add"}
        </Button>
      </Box>

      <Paper elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f3e5f5" }}>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {departments.map((dept) => (
              <TableRow
                key={dept.departmentId}
                ref={(el) => (departmentRefs.current[dept.departmentId] = el)}
              >
                <TableCell>{dept.departmentId}</TableCell>
                <TableCell>{dept.name}</TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => handleEdit(dept)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(dept.departmentId)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}

export default Departments;
