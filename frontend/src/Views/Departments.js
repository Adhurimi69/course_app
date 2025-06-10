// src/Views/Departments.js
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./Departments.css";

function Departments() {
  const location = useLocation();
  const highlightId = location.state?.highlightId;

  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);

  // ref për secilin department
  const departmentRefs = useRef({});

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Shtesë për scroll dhe highlight kur ndryshon highlightId
  useEffect(() => {
  if (highlightId && departmentRefs.current[highlightId]) {
    departmentRefs.current[highlightId].scrollIntoView({ behavior: "smooth", block: "center" });
    departmentRefs.current[highlightId].classList.add("highlight");
    const timer = setTimeout(() => {
      departmentRefs.current[highlightId]?.classList.remove("highlight");
    }, 3000);
    return () => clearTimeout(timer);
  }
}, [highlightId, departments]);

console.log('highlightId:', highlightId, typeof highlightId);
departments.forEach(dept => {
  console.log('departmentId:', dept.departmentId, typeof dept.departmentId);
});



  const fetchDepartments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/queries/departments");
      setDepartments(res.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/commands/departments/${editingId}`,
          { name }
        );
        setEditingId(null);
      } else {
        await axios.post("http://localhost:5000/api/commands/departments", { name });
      }
      setName("");
      fetchDepartments();
    } catch (error) {
      alert(error.response?.data?.error || "Error occurred");
    }
  };

  const handleEdit = (department) => {
    setEditingId(department.departmentId);
    setName(department.name);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await axios.delete(`http://localhost:5000/api/commands/departments/${id}`);
        fetchDepartments();
      } catch (error) {
        console.error("Error deleting department:", error);
      }
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
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      <ul className="departments-list">
        {departments.map((dept) => (
          <li
            key={dept.departmentId}
            className="department-item"
            ref={(el) => (departmentRefs.current[dept.departmentId] = el)}
          >
            <span>{dept.name}</span>
            <div className="actions">
              <button
                className="button edit-button"
                onClick={() => handleEdit(dept)}
              >
                Edit
              </button>
              <button
                className="button delete-button"
                onClick={() => handleDelete(dept.departmentId)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Departments;
