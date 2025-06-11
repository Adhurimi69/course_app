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

export default function Lectures() {
  const [lectures, setLectures] = useState([]);
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchLectures();
    fetchCourses();
  }, []);

  const fetchLectures = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/queries/lectures");
      setLectures(res.data);
    } catch (err) {
      console.error("Error fetching lectures:", err);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/queries/courses");
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseId) return alert("Please select a course.");
    const data = { title, courseId };
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/commands/lectures/${editingId}`, data);
        setEditingId(null);
      } else {
        await axios.post("http://localhost:5000/api/commands/lectures", data);
      }
      setTitle("");
      setCourseId("");
      fetchLectures();
    } catch (err) {
      console.error("Error submitting lecture:", err);
    }
  };

  const handleEdit = (lecture) => {
    setEditingId(lecture.lectureId);
    setTitle(lecture.title);
    setCourseId(lecture.courseId || "");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lecture?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/commands/lectures/${id}`);
      fetchLectures();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Lecture Management
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
          label="Lecture Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          size="small"
          sx={{ minWidth: 200, backgroundColor: "#fff" }}
        />
        <Select
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          displayEmpty
          required
          size="small"
          sx={{ minWidth: 220, backgroundColor: "#fff" }}
        >
          <MenuItem value="">
            <em>-- Select Course --</em>
          </MenuItem>
          {courses.map((c) => (
            <MenuItem key={c.courseId} value={c.courseId}>
              {c.title}
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
              <TableCell><strong>Course</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lectures.map((lecture) => (
              <TableRow key={lecture.lectureId}>
                <TableCell>{lecture.lectureId}</TableCell>
                <TableCell>{lecture.title}</TableCell>
                <TableCell>
                  {courses.find((c) => c.courseId === lecture.courseId)?.title || "N/A"}
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={() => handleEdit(lecture)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(lecture.lectureId)}
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
