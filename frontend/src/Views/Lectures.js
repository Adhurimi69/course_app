import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Departments.css'; // Përdor të njëjtin stil për thjeshtësi

function Lectures() {
  const [lectures, setLectures] = useState([]);
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState('');
  const [courses, setCourses] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchLectures();
    fetchCourses();
  }, []);

  const fetchLectures = async () => {
    const res = await axios.get('http://localhost:5000/api/lectures');
    setLectures(res.data);
  };

  const fetchCourses = async () => {
    const res = await axios.get('http://localhost:5000/api/courses');
    setCourses(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { title, courseId };
      if (editingId) {
        await axios.put(`http://localhost:5000/api/lectures/${editingId}`, data);
        setEditingId(null);
      } else {
        await axios.post('http://localhost:5000/api/lectures', data);
      }
      setTitle('');
      setCourseId('');
      fetchLectures();
    } catch (error) {
      alert(error.response?.data?.error || 'Error occurred');
    }
  };

  const handleEdit = (lecture) => {
    setEditingId(lecture.id);
    setTitle(lecture.title);
    setCourseId(lecture.courseId);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lecture?')) {
      await axios.delete(`http://localhost:5000/api/lectures/${id}`);
      fetchLectures();
    }
  };

  return (
    <div className="departments-container">
      <h2>Lecture Management</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Lecture Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="input"
        />
        <select
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          required
          className="input"
        >
          <option value="">Select Course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>{course.title}</option>
          ))}
        </select>
        <button type="submit" className="button submit-button">
          {editingId ? 'Update' : 'Add'}
        </button>
      </form>

      <ul className="departments-list">
        {lectures.map((lecture) => (
          <li key={lecture.id} className="department-item">
            <span>{lecture.title} — <em>{lecture.Course?.title || 'No Course'}</em></span>
            <div className="actions">
              <button className="button edit-button" onClick={() => handleEdit(lecture)}>Edit</button>
              <button className="button delete-button" onClick={() => handleDelete(lecture.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Lectures;
