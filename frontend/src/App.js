import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css'; // Assuming you're going to add styles here

function App() {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const res = await axios.get('http://localhost:5000/api/courses');
    setCourses(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/courses', { title, description });
    setTitle('');
    setDescription('');
    fetchCourses();
  };

  return (
    <div className="App">
      <h1 className="title">Course Management System</h1>
      
      <form className="form" onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Course Title" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="input"
        />
        <textarea 
          placeholder="Course Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="textarea"
        ></textarea>
        <button type="submit" className="button">Add Course</button>
      </form>

      <h2 className="courses-title">Courses List</h2>
      <ul className="courses-list">
        {courses.map((course) => (
          <li key={course.id} className="course-item">
            <h3 className="course-title">{course.title}</h3>
            <p className="course-description">{course.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
