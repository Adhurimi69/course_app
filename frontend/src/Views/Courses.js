// src/Views/Courses.js

import React, { useEffect, useState } from "react";
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
import CourseModal from "../components/CourseModal";

export default function Courses({ teacherView = false, studentView = false }) {
  // State
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);

  // Admin/Teacher form & modal state
  const [title, setTitle] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Modal open state (teacher only)
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("create"); // "create" or "edit"

  // Fetch data on mount
  useEffect(() => {
    fetchCourses();
    fetchDepartments();
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
      const res = await axios.get(
        "http://localhost:5000/api/queries/departments"
      );
      setDepartments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Admin inline form submit
  const handleSubmitInline = async (e) => {
    e.preventDefault();
    if (!departmentId) return alert("Please select a department.");
    const payload = { title, departmentId };
    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/commands/courses/${editingId}`,
          payload
        );
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

  // Delete handler (admin/teacher)
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/commands/courses/${id}`);
      fetchCourses();
    } catch (err) {
      console.error(err);
    }
  };

  // Modal controls (teacher only)
  const openModal = (action, course = null) => {
    setMode(action);
    if (action === "edit" && course) {
      setEditingId(course.courseId);
      setTitle(course.title);
      setDepartmentId(course.departmentId);
    } else {
      setEditingId(null);
      setTitle("");
      setDepartmentId("");
    }
    setOpen(true);
  };
  const closeModal = () => setOpen(false);

  // Modal submit (teacher only)
  const handleSubmitModal = async () => {
    if (!departmentId) return alert("Please select a department.");
    const payload = { title, departmentId };
    try {
      if (mode === "edit") {
        await axios.put(
          `http://localhost:5000/api/commands/courses/${editingId}`,
          payload
        );
      } else {
        await axios.post("http://localhost:5000/api/commands/courses", payload);
      }
      closeModal();
      fetchCourses();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Course Management
      </Typography>

      {/* 1) Admin view: inline form + styled table */}
      {!teacherView && !studentView && (
        <>
          <Box
            component="form"
            onSubmit={handleSubmitInline}
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
          </Box>

          <Paper elevation={3}>
            <Table>
              <TableHead sx={{ backgroundColor: "#f3e5f5" }}>
                <TableRow>
                  <TableCell>
                    <strong>ID</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Title</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Department</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.courseId}>
                    <TableCell>{course.courseId}</TableCell>
                    <TableCell>{course.title}</TableCell>
                    <TableCell>
                      {departments.find(
                        (d) => d.departmentId === course.departmentId
                      )?.name || "N/A"}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        onClick={() => openModal("edit", course)}
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDelete(course.courseId)}
                      >
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

      {/* 2) Teacher view: Add Course button */}
      {teacherView && !studentView && (
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => openModal("create")}
          >
            Add Course
          </Button>
        </Box>
      )}

      {/* 3) Teacher & Student view: grid of cards */}
      {(teacherView || studentView) && (
        <Grid container spacing={4}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course.courseId}>
              <CourseCard
                course={course}
                departments={departments}
                {...(teacherView
                  ? { openModal, onDelete: handleDelete, role: "teacher" }
                  : { role: "student" })}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* 4) CourseModal only for admin/teacher */}
      {!studentView && (
        <CourseModal
          open={open}
          mode={mode}
          title={title}
          departmentId={departmentId}
          departments={departments}
          onClose={closeModal}
          onChangeTitle={setTitle}
          onChangeDept={setDepartmentId}
          onSubmit={handleSubmitModal}
        />
      )}
    </Box>
  );
}
