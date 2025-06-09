import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [lectureId, setLectureId] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchAssignments();
    fetchLectures();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/queries/assignments");
      setAssignments(res.data);
    } catch (err) {
      console.error("Error fetching assignments:", err);
    }
  };

  const fetchLectures = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/queries/lectures");
      setLectures(res.data);
    } catch (err) {
      console.error("Error fetching lectures:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!lectureId) {
      alert("Please select a lecture.");
      return;
    }

    const data = { title, dueDate, lectureId };

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/commands/assignments/${editingId}`,
          data
        );
        setEditingId(null);
      } else {
        await axios.post("http://localhost:5000/api/commands/assignments", data);
      }

      setTitle("");
      setDueDate("");
      setLectureId("");
      fetchAssignments();
    } catch (err) {
      console.error("Error submitting assignment:", err);
    }
  };

  const handleEdit = (assignment) => {
    setEditingId(assignment.assignmentId); // përdor assignmentId
    setTitle(assignment.title);
    setDueDate(assignment.dueDate ? assignment.dueDate.slice(0, 10) : "");
    setLectureId(assignment.lectureId || "");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      try {
        await axios.delete(`http://localhost:5000/api/commands/assignments/${id}`);
        fetchAssignments();
      } catch (err) {
        console.error("Error deleting assignment:", err);
      }
    }
  };

  return (
    <div className="assignment-page container">
      <form onSubmit={handleSubmit} className="assignment-form">
        <input
          type="text"
          placeholder="Assignment Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <select
          value={lectureId}
          onChange={(e) => setLectureId(e.target.value)}
          required
        >
          <option value="">-- Select Lecture --</option>
          {lectures.map((lecture) => (
            <option key={lecture.lectureId} value={lecture.lectureId}>
              {lecture.title}
            </option>
          ))}
        </select>
        <button type="submit">{editingId ? "Update" : "Add"} Assignment</button>
      </form>

      <ul className="assignment-list">
        {assignments.map((assignment) => (
          <li key={assignment.assignmentId}>
            {assignment.title} - Lecture ID: {assignment.lectureId || "N/A"} - Due:{" "}
            {assignment.dueDate ? assignment.dueDate.slice(0, 10) : "No due date"}
            <button onClick={() => handleEdit(assignment)}>Edit</button>
            <button onClick={() => handleDelete(assignment.assignmentId)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
