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

export default function Exams() {
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [courseId, setCourseId] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchExams();
    fetchCourses();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/queries/exams");
      setExams(res.data);
    } catch (err) {
      console.error("Error fetching exams:", err);
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
    if (!courseId || !date) return alert("Please select a course and date.");

    const data = { title, courseId, date };
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/commands/exams/${editingId}`, data);
        setEditingId(null);
      } else {
        await axios.post("http://localhost:5000/api/commands/exams", data);
      }
      setTitle("");
      setDate("");
      setCourseId("");
      fetchExams();
    } catch (err) {
      console.error("Error submitting exam:", err);
    }
  };

  const handleEdit = (exam) => {
    setEditingId(exam.examId);
    setTitle(exam.title);
    setDate(exam.date ? exam.date.slice(0, 10) : "");
    setCourseId(exam.courseId || "");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      try {
        await axios.delete(`http://localhost:5000/api/commands/exams/${id}`);
        fetchExams();
      } catch (err) {
        console.error("Error deleting exam:", err);
      }
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Exam Management
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
          flexWrap: "wrap"
        }}
      >
        <TextField
          label="Exam Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          size="small"
          sx={{ minWidth: 200, backgroundColor: "#fff" }}
        />
        <TextField
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          size="small"
          sx={{ minWidth: 160, backgroundColor: "#fff" }}
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
          {courses.map((course) => (
            <MenuItem key={course.courseId} value={course.courseId}>
              {course.title}
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
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Course</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {exams.map((exam) => (
              <TableRow key={exam.examId}>
                <TableCell>{exam.examId}</TableCell>
                <TableCell>{exam.title}</TableCell>
                <TableCell>{exam.date ? exam.date.slice(0, 10) : "-"}</TableCell>
                <TableCell>
                  {courses.find((c) => c.courseId === exam.courseId)?.title || "N/A"}
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={() => handleEdit(exam)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(exam.examId)}
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
