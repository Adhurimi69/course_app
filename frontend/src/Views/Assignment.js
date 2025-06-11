import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  TextField,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [lectureId, setLectureId] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchAssignments();
    fetchLectures();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/queries/assignments");
      setAssignments(res.data);
    } catch (err) {
      console.error("Error fetching assignments:", err);
    }
  };

  const fetchLectures = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/queries/lectures");
      setLectures(res.data);
    } catch (err) {
      console.error("Error fetching lectures:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!lectureId) return alert("Please select a lecture.");

    const data = { title, dueDate, lectureId };

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/commands/assignments/${editingId}`, data);
        setEditingId(null);
      } else {
        await axios.post("http://localhost:5000/api/commands/assignments", data);
      }
      setTitle("");
      setDueDate("");
      setLectureId("");
      fetchAssignments();
    } catch (err) {
      console.error("Error submitting assignment:", err);
    }
  };

  const handleEdit = (assignment) => {
    setEditingId(assignment.assignmentId);
    setTitle(assignment.title);
    setDueDate(assignment.dueDate ? assignment.dueDate.slice(0, 10) : "");
    setLectureId(assignment.lectureId || "");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      try {
        await axios.delete(`http://localhost:5000/api/commands/assignments/${id}`);
        fetchAssignments();
      } catch (err) {
        console.error("Error deleting assignment:", err);
      }
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Assignment Management
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          mb: 3,
          backgroundColor: "#f3e5f5",
          padding: 2,
          borderRadius: 2,
          boxShadow: 1,
          flexWrap: "wrap",
        }}
      >
        <TextField
          label="Assignment Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          size="small"
          sx={{ minWidth: 180, backgroundColor: "#fff" }}
        />
        <TextField
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          label="Due Date"
          InputLabelProps={{ shrink: true }}
          size="small"
          sx={{ minWidth: 160, backgroundColor: "#fff" }}
        />
        <Select
          value={lectureId}
          onChange={(e) => setLectureId(e.target.value)}
          displayEmpty
          required
          size="small"
          sx={{ minWidth: 220, backgroundColor: "#fff" }}
        >
          <MenuItem value="">
            <em>-- Select Lecture --</em>
          </MenuItem>
          {lectures.map((lecture) => (
            <MenuItem key={lecture.lectureId} value={lecture.lectureId}>
              {lecture.title}
            </MenuItem>
          ))}
        </Select>
        <Button
          variant="contained"
          color="secondary"
          type="submit"
          size="medium"
          sx={{ height: "40px", minWidth: "120px" }}
        >
          {editingId ? "Update" : "Add"}
        </Button>
      </Box>

      <Paper elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f3e5f5" }}>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Title</strong></TableCell>
              <TableCell><strong>Lecture</strong></TableCell>
              <TableCell><strong>Due Date</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assignments.map((a) => (
              <TableRow key={a.assignmentId}>
                <TableCell>{a.assignmentId}</TableCell>
                <TableCell>{a.title}</TableCell>
                <TableCell>{lectures.find((l) => l.lectureId === a.lectureId)?.title || "N/A"}</TableCell>
                <TableCell>{a.dueDate ? a.dueDate.slice(0, 10) : "No due date"}</TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={() => handleEdit(a)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(a.assignmentId)}
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
