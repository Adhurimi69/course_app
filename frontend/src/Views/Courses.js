// ./Views/Courses.js
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [title, setTitle] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCourses();
    fetchDepartments();
  }, []);

  const fetchCourses = async () => {
    const res = await axios.get("http://localhost:5000/api/queries/courses");
    setCourses(res.data);
  };

  const fetchDepartments = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/queries/departments"
    );
    setDepartments(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!departmentId) {
      alert("Please select a department.");
      return;
    }

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

  const handleEdit = (course) => {
    setEditingId(course.id);
    setTitle(course.title);
    setDepartmentId(course.departmentId || "");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      await axios.delete(`http://localhost:5000/api/commands/courses/${id}`);
      fetchCourses();
    }
  };

  return (
    <div className="course-page container">
      <form onSubmit={handleSubmit} className="course-form">
        <input
          type="text"
          placeholder="Course Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <select
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
          required
        >
          <option value="">-- Select Department --</option>
          {departments.map((dept) => (
            <option key={dept.departmentId} value={dept.departmentId}>
              {dept.name}
            </option>
          ))}
        </select>
        <button type="submit">{editingId ? "Update" : "Add"} Course</button>
      </form>

      <ul className="course-list">
        {courses.map((course) => (
          <li key={course.id}>
            {course.title} - Dept ID: {course.departmentId || "N/A"}
            <button onClick={() => handleEdit(course)}>Edit</button>
            <button onClick={() => handleDelete(course.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
