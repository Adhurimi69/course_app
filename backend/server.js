const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/db');
const courseRoutes = require('./routes/courseRoutes');
const userRoutes = require('./routes/userRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const lectureRoutes = require('./routes/lectureRoutes');

// const categoryRoutes = require('./routes/categoryRoutes');
// const enrollmentRoutes = require('./routes/enrollmentRoutes');
// const assignmentRoutes = require('./routes/assignmentRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/lectures', lectureRoutes);
// app.use('/api/categories', categoryRoutes);
// app.use('/api/enrollments', enrollmentRoutes);
// app.use('/api/assignments', assignmentRoutes);

// 🟢 Importo të gjitha modelet para se të bëhet sync
require('./models/Department');
require('./models/Course');
require('./models/Lecture');



const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully!');
    await sequelize.sync(); // ose sync({ force: true }) për test
    console.log('Database tables created or synced!');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
