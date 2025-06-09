import React, { useEffect, useState } from "react";
import axios from "axios";

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
    if (!courseId || !date) {
      alert("Please select a course and date.");
      return;
    }

    const data = { title, courseId, date };

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/commands/exams/${editingId}`,
          data
        );
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
    setEditingId(exam.examId); // use examId as key
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
    <div className="exam-page container">
      <form onSubmit={handleSubmit} className="exam-form">
        <input
          type="text"
          placeholder="Exam Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <select
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          required
        >
          <option value="">-- Select Course --</option>
          {courses.map((course) => (
            <option
              key={course.courseId || course.id}
              value={course.courseId || course.id}
            >
              {course.title || course.name}
            </option>
          ))}
        </select>
        <button type="submit">{editingId ? "Update" : "Add"} Exam</button>
      </form>

      <ul className="exam-list">
        {exams.map((exam) => (
          <li key={exam.examId}>
            {exam.title} - Course ID: {exam.courseId || "N/A"} - Date:{" "}
            {exam.date ? exam.date.slice(0, 10) : "No date"}
            <button onClick={() => handleEdit(exam)}>Edit</button>
            <button onClick={() => handleDelete(exam.examId)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
