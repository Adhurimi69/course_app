import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Users() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');  // Add password state
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get('http://localhost:5000/api/users');
    setUsers(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = { name, email, password, role };  // Include password in the payload
    if (editingId) {
      // Update user
      await axios.put(`http://localhost:5000/api/users/${editingId}`, userData);
      setEditingId(null);
    } else {
      // Create new user
      await axios.post('http://localhost:5000/api/users', userData);
    }
    // Reset the form fields
    setName('');
    setEmail('');
    setRole('');
    setPassword('');  // Reset password field
    fetchUsers();
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setPassword('');  // Keep password empty when editing user
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      fetchUsers();
    }
  };

  return (
    <div className="Users">
      <h1 className="title">User Management</h1>

      <form className="form" onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="User Name" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="input"
        />
        <input 
          type="email" 
          placeholder="User Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input"
        />
        <input 
          type="password"  // Password input field
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input"
        />
        <input 
          type="text" 
          placeholder="User Role" 
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          className="input"
        />
        <button type="submit" className="button">
          {editingId ? 'Update User' : 'Add User'}
        </button>
      </form>

      <h2 className="users-title">Users List</h2>
      <ul className="users-list">
        {users.map((user) => (
          <li key={user.id} className="user-item">
            <h3 className="user-name">{user.name}</h3>
            <p className="user-email">{user.email}</p>
            <p className="user-role">{user.role}</p>
            <button onClick={() => handleEdit(user)} className="button edit-button">Edit</button>
            <button onClick={() => handleDelete(user.id)} className="button delete-button">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Users;
