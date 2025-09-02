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

import CourseCard from "../components/CourseCard";

export default function Courses({ teacherView = false, studentView = false }) {
  const location = useLocation();
  const isViewingCourse = /^\/students\/courses\/\d+/.test(location.pathname);
  const studentId = JSON.parse(localStorage.getItem("user"))?.id;

  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);

  // Admin inline form states
  const [title, setTitle] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchDepartments();
    if (studentView) {
      fetchStudentCourses();
    } else {
      fetchCourses();
    }
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/queries/courses");
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/queries/departments");
      setDepartments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStudentCourses = async () => {
    try {
      const enrolledRes = await axios.get(
        `http://localhost:5000/api/commands/student-courses/enrolled/${studentId}`
      );
      const availableRes = await axios.get(
        `http://localhost:5000/api/commands/student-courses/available/${studentId}`
      );
      setEnrolledCourses(enrolledRes.data);
      setAvailableCourses(availableRes.data);
    } catch (err) {
      console.error("Error fetching student courses:", err);
    }
  };

  const enrollCourse = async (courseId) => {
    try {
      await axios.post("http://localhost:5000/api/commands/student-courses", {
        studentId,
        courseId,
      });
      fetchStudentCourses();
    } catch (err) {
      console.error("Enrollment failed:", err);
    }
  };

  // Admin add/update course
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!departmentId) return alert("Please select a department.");
    const payload = { title, departmentId };
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/commands/courses/${editingId}`, payload);
        setEditingId(null);
      } else {
        await axios.post("http://localhost:5000/api/commands/courses", payload);
      }
      setTitle("");
      setDepartmentId("");
      fetchCourses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (course) => {
    setEditingId(course.courseId);
    setTitle(course.title);
    setDepartmentId(course.departmentId);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/commands/courses/${id}`);
      if (studentView) fetchStudentCourses();
      else fetchCourses();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Course Management
      </Typography>

      {/* Admin Inline Form */}
      {!teacherView && !studentView && (
        <>
          <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        gap: 2,
        alignItems: "center",
        mb: 3,
        backgroundColor: "#f3e5f5",
        p: 2,
        borderRadius: 2,
        boxShadow: 1,
        flexWrap: "wrap",
      }}
    >
      <TextField
        label="Course Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        size="small"
        sx={{ minWidth: 200, backgroundColor: "#fff" }}
      />
      <Select
        value={departmentId}
        onChange={(e) => setDepartmentId(e.target.value)}
        displayEmpty
        required
        size="small"
        sx={{ minWidth: 220, backgroundColor: "#fff" }}
      >
        <MenuItem value="">
          <em>-- Select Department --</em>
        </MenuItem>
        {departments.map((d) => (
          <MenuItem key={d.departmentId} value={d.departmentId}>
            {d.name}
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

      {/* Cancel button only shows during editing */}
      {editingId && (
        <Button
          variant="outlined"
          color="inherit"
          size="medium"
          onClick={() => {
            setEditingId(null);
            setTitle("");
            setDepartmentId("");
          }}
        >
          Cancel
        </Button>
      )}
    </Box>

          {/* Admin Courses Table */}
          <Paper elevation={3}>
            <Table>
              <TableHead sx={{ backgroundColor: "#f3e5f5" }}>
                <TableRow>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Title</strong></TableCell>
                  <TableCell><strong>Department</strong></TableCell>
                  <TableCell align="right"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.courseId}>
                    <TableCell>{course.courseId}</TableCell>
                    <TableCell>{course.title}</TableCell>
                    <TableCell>
                      {departments.find((d) => d.departmentId === course.departmentId)?.name || "N/A"}
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" onClick={() => handleEdit(course)} sx={{ mr: 1 }}>
                        Edit
                      </Button>
                      <Button size="small" color="error" onClick={() => handleDelete(course.courseId)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </>
      )}

      {/* Teacher View */}
      {teacherView && !studentView && (
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button variant="contained" startIcon={<AddIcon />}>
            Add Course
          </Button>
        </Box>
      )}

      {/* Student View */}
      {studentView && !isViewingCourse && (
        <>
          <Typography variant="h5" mt={4} gutterBottom>Enrolled Courses</Typography>
          <Grid container spacing={4}>
            {enrolledCourses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course.courseId}>
                <CourseCard
                  course={course}
                  isEnrolled
                  departments={departments}
                  role="student"
                />
              </Grid>
            ))}
          </Grid>

          <Typography variant="h5" mt={6} gutterBottom>Available Courses</Typography>
          <Grid container spacing={4}>
            {availableCourses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course.courseId}>
                <CourseCard
                  course={course}
                  departments={departments}
                  role="student"
                  onEnroll={() => enrollCourse(course.courseId)}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
}
