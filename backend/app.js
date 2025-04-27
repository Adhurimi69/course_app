const express = require('express');
const cors = require('cors');
const app = express();
const courseRoutes = require('./routes/courseRoutes');
const userRoutes = require('./routes/userRoutes');

app.use(cors());
app.use(express.json());

app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
