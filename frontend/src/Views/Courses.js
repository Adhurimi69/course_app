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

import CourseCard from "../components/CourseCard";
import CourseModal from "../components/CourseModal";
import AddIcon from "@mui/icons-material/Add";

export default function Courses({ teacherView = false }) {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [title, setTitle] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("create");

  useEffect(() => {
    fetchCourses();
    fetchDepartments();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/queries/courses");
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/queries/departments");
      setDepartments(res.data);
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };

  const handleSubmitInline = async (e) => {
    e.preventDefault();
    if (!departmentId) return alert("Please select a department.");
    const data = { title, departmentId };
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/commands/courses/${editingId}`, data);
        setEditingId(null);
      } else {
        await axios.post("http://localhost:5000/api/commands/courses", data);
      }
      setTitle("");
      setDepartmentId("");
      fetchCourses();
    } catch (err) {
      console.error("Error submitting course:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/commands/courses/${id}`);
      fetchCourses();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const openModal = (action, course = null) => {
    setMode(action);
    if (action === "edit" && course) {
      setEditingId(course.courseId);
      setTitle(course.title);
      setDepartmentId(course.departmentId || "");
    } else {
      setEditingId(null);
      setTitle("");
      setDepartmentId("");
    }
    setOpen(true);
  };

  const closeModal = () => setOpen(false);

  const handleSubmitModal = async () => {
    if (!departmentId) return alert("Please select a department.");
    const data = { title, departmentId };
    try {
      if (mode === "edit") {
        await axios.put(`http://localhost:5000/api/commands/courses/${editingId}`, data);
      } else {
        await axios.post("http://localhost:5000/api/commands/courses", data);
      }
      closeModal();
      fetchCourses();
    } catch (err) {
      console.error("Error submitting course:", err);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Course Management
      </Typography>

      {!teacherView && (
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
              padding: 2,
              borderRadius: 2,
              boxShadow: 1,
              flexWrap: "wrap"
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
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={() => openModal("edit", course)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
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

      {/* Teacher View – unchanged */}
      {teacherView && (
        <>
          <Box className="flex justify-end mb-4">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => openModal("create")}
            >
              Add Course
            </Button>
          </Box>

          <Box display="flex" flexWrap="wrap" gap={2}>
            {courses.map((course) => (
              <CourseCard
                key={course.courseId}
                course={course}
                departments={departments}
                openModal={openModal}
                onDelete={handleDelete}
              />
            ))}
          </Box>
        </>
      )}

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
    </Box>
  );
}
