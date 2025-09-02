import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  TextField,
  Select,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function Lectures({ teacherView = false, studentView = false }) {
  const location = useLocation();
  const isViewingLecture = /^\/students\/lectures\/\d+/.test(location.pathname);

  const studentId =
    JSON.parse(localStorage.getItem("user"))?.studentId ??
    JSON.parse(localStorage.getItem("user"))?.id;

  const [lectures, setLectures] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrolledLectures, setEnrolledLectures] = useState([]);
  const [availableLectures, setAvailableLectures] = useState([]);

  // Inline form states
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCourses();
    if (studentView) {
      fetchStudentLectures();
    } else {
      fetchLectures();
    }
  }, []);

  const fetchLectures = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/queries/lectures");
      setLectures(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/queries/courses");
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStudentLectures = async () => {
    if (!studentId) return;
    try {
      const enrolledRes = await axios.get(
        `http://localhost:5000/api/commands/student-lectures/enrolled/${studentId}`
      );
      const availableRes = await axios.get(
        `http://localhost:5000/api/commands/student-lectures/available/${studentId}`
      );
      setEnrolledLectures(enrolledRes.data);
      setAvailableLectures(availableRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const enrollLecture = async (lectureId) => {
    try {
      await axios.post("http://localhost:5000/api/commands/student-lectures", {
        studentId,
        lectureId,
      });
      fetchStudentLectures();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseId) return alert("Please select a course.");
    const payload = { title, courseId };
    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/commands/lectures/${editingId}`,
          payload
        );
        setEditingId(null);
      } else {
        await axios.post("http://localhost:5000/api/commands/lectures", payload);
      }
      setTitle("");
      setCourseId("");
      fetchLectures();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (lecture) => {
    setEditingId(lecture.lectureId);
    setTitle(lecture.title);
    setCourseId(lecture.courseId);
  };

  const handleDelete = async (lectureId) => {
    if (!window.confirm("Delete this lecture?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/commands/lectures/${lectureId}`);
      if (studentView) fetchStudentLectures();
      else fetchLectures();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setTitle("");
    setCourseId("");
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Lecture Management
      </Typography>

      {/* Admin Inline Form */}
      {!teacherView && !studentView && (
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
            mb: 3,
            backgroundColor: "#f3e5f5",
            p: 2,
            borderRadius: 2,
            boxShadow: 1,
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
            sx={{ height: 40, minWidth: 120 }}
          >
            {editingId ? "Update" : "Add"}
          </Button>
          {editingId && (
            <Button
              variant="outlined"
              color="inherit"
              size="medium"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          )}
        </Box>
      )}

      {/* Admin / Teacher Table */}
      {(!studentView || (teacherView && !studentView)) && (
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
                    {courses.find((c) => String(c.courseId) === String(lecture.courseId))?.title || "N/A"}
                  </TableCell>
                  <TableCell align="right">
                    <Button size="small" onClick={() => handleEdit(lecture)} sx={{ mr: 1 }}>
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
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
      )}
    </Box>
  );
}
