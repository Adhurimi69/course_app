import React, { useEffect, useState } from "react";
import axios from "axios";

import { Box, Button, Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import CourseCard from "../components/CourseCard";
import CourseModal from "../components/CourseModal";

export default function Courses({ teacherView = false }) {
  // data
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);

  // inline form state (for admin)
  const [title, setTitle] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [editingId, setEditingId] = useState(null);

  // modal state (for teacher)
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("create"); // "create" or "edit"

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
      const res = await axios.get(
        "http://localhost:5000/api/queries/departments"
      );
      setDepartments(res.data);
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };

  // Admin inline form submit
  const handleSubmitInline = async (e) => {
    e.preventDefault();
    if (!departmentId) return alert("Please select a department.");

    const data = { title, departmentId };
    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/commands/courses/${editingId}`,
          data
        );
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

  // Modal open/close
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

  // Modal submit (create or update)
  const handleSubmitModal = async () => {
    if (!departmentId) return alert("Please select a department.");
    const data = { title, departmentId };
    try {
      if (mode === "edit") {
        await axios.put(
          `http://localhost:5000/api/commands/courses/${editingId}`,
          data
        );
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
    <div className="course-page container mx-auto p-4">
      {/* Admin inline form */}
      {!teacherView && (
        <form
          onSubmit={handleSubmitInline}
          className="course-form flex space-x-2 mb-6"
        >
          <input
            className="border rounded px-2 py-1 flex-1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Course Title"
            required
          />
          <select
            className="border rounded px-2 py-1"
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            required
          >
            <option value="">-- Select Department --</option>
            {departments.map((d) => (
              <option key={d.departmentId} value={d.departmentId}>
                {d.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4"
          >
            {editingId ? "Update" : "Add"}
          </button>
        </form>
      )}

      {/* Teacher: Add Course Button */}
      {teacherView && (
        <Box className="flex justify-end mb-4">
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => openModal("create")}
          >
            Add Course
          </Button>
        </Box>
      )}

      {/* Courses Display */}
      {teacherView ? (
        <Grid container spacing={4}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} lg={4} key={course.courseId}>
              <CourseCard
                course={course}
                departments={departments}
                openModal={openModal}
                onDelete={handleDelete}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <ul className="space-y-2">
          {courses.map((course) => (
            <li
              key={course.courseId}
              className="flex justify-between items-center border-b pb-2"
            >
              <span>
                {course.title} — Dept:{" "}
                {departments.find((d) => d.departmentId === course.departmentId)
                  ?.name || "N/A"}
              </span>
              <div className="space-x-2">
                <button
                  onClick={() => openModal("edit", course)}
                  className="text-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(course.courseId)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Course Modal */}
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
    </div>
  );
}
