const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/db'); // Database connection
const courseRoutes = require('./routes/courseRoutes'); // Import the routes

const app = express(); // << this must be declared before using app.get, app.post, etc.

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Course Management System Backend is working!');
});

// API Routes
app.use('/api/courses', courseRoutes); // use the router from courseRoutes.js

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  
  try {
    // Check the database connection
    await sequelize.authenticate();
    console.log('Database connected successfully!');

    // Sync the models (create tables if they don't exist)
    await sequelize.sync();
    console.log('Database tables created or synced!');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
