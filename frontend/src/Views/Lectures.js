// ./Views/Lectures.js
import React, { useEffect, useState } from "react";
import axios from "axios";

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
    if (!courseId) {
      alert("Please select a course.");
      return;
    }

    const data = { title, courseId };

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/commands/lectures/${editingId}`,
          data
        );
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
    setEditingId(lecture.lectureId); // përdor lectureId
    setTitle(lecture.title);
    setCourseId(lecture.courseId || "");
  };

  const handleDelete = async (id) => {
    if (!id) {
      alert("Invalid lecture id");
      return;
    }
    if (window.confirm("Are you sure you want to delete this lecture?")) {
      try {
        await axios.delete(`http://localhost:5000/api/commands/lectures/${id}`);
        fetchLectures();
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Delete failed. Please try again.");
      }
    }
  };

  return (
    <div className="lecture-page container">
      <form onSubmit={handleSubmit} className="lecture-form">
        <input
          type="text"
          placeholder="Lecture Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <select
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          required
        >
          <option value="">-- Select Course --</option>
          {courses.map((course) => (
            <option key={course.courseId} value={course.courseId}>
              {course.title}
            </option>
          ))}
        </select>
        <button type="submit">{editingId ? "Update" : "Add"} Lecture</button>
      </form>

      <ul className="lecture-list">
        {lectures.map((lecture) => (
          <li key={lecture.lectureId}>
            {lecture.title} - Course ID: {lecture.courseId || "N/A"}
            <button onClick={() => handleEdit(lecture)}>Edit</button>
            <button onClick={() => handleDelete(lecture.lectureId)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
