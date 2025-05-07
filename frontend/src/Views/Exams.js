import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Exams() {
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState('');
  const [date, setDate] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchExams();
    fetchCourses();
  }, []);

  const fetchExams = async () => {
    const res = await axios.get('http://localhost:5000/api/exams');
    setExams(res.data);
  };

  const fetchCourses = async () => {
    const res = await axios.get('http://localhost:5000/api/courses');
    setCourses(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseId || !date) {
      alert('Please select a course and date.');
      return;
    }

    const data = { title, courseId, date };

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/exams/${editingId}`, data);
        setEditingId(null);
      } else {
        await axios.post('http://localhost:5000/api/exams', data);
      }

      setTitle('');
      setCourseId('');
      setDate('');
      fetchExams();
    } catch (err) {
      console.error("Error submitting exam:", err.response?.data || err.message);
    }
  };

  const handleEdit = (exam) => {
    setEditingId(exam.id);
    setTitle(exam.title);
    setCourseId(exam.courseId || '');
    setDate(exam.date?.split('T')[0] || '');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      await axios.delete(`http://localhost:5000/api/exams/${id}`);
      fetchExams();
    }
  };

  return (
    <div className="departments-container">
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          className="input"
          placeholder="Exam Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="date"
          className="input"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <select
          className="input"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          required
        >
          <option value="">-- Select Course --</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
        <button type="submit" className="button submit-button">
          {editingId ? 'Update' : 'Add'} Exam
        </button>
      </form>

      <ul className="departments-list">
        {exams.map((exam) => (
          <li key={exam.id} className="department-item">
            <span>
              <strong>{exam.title}</strong> - {exam.date?.split('T')[0]} - Course ID: {exam.courseId}
            </span>
            <div className="actions">
              <button className="button edit-button" onClick={() => handleEdit(exam)}>Edit</button>
              <button className="button delete-button" onClick={() => handleDelete(exam.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
