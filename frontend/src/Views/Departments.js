// src/Views/Departments.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Departments.css';

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    const res = await axios.get('http://localhost:5000/api/departments');
    setDepartments(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/departments/${editingId}`, { name });
        setEditingId(null);
      } else {
        await axios.post('http://localhost:5000/api/departments', { name });
      }
      setName('');
      fetchDepartments();
    } catch (error) {
      alert(error.response?.data?.error || 'Error occurred');
    }
  };

  const handleEdit = (department) => {
    setEditingId(department.id);
    setName(department.name);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      await axios.delete(`http://localhost:5000/api/departments/${id}`);
      fetchDepartments();
    }
  };

  return (
    <div className="departments-container">
      <h2>Department Management</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Department Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="input"
        />
        <button type="submit" className="button submit-button">
          {editingId ? 'Update' : 'Add'}
        </button>
      </form>

      <ul className="departments-list">
        {departments.map((dept) => (
          <li key={dept.id} className="department-item">
            <span>{dept.name}</span>
            <div className="actions">
              <button className="button edit-button" onClick={() => handleEdit(dept)}>Edit</button>
              <button className="button delete-button" onClick={() => handleDelete(dept.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Departments;
