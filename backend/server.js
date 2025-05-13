const express = require("express");
const cors = require("cors");
const connectMongo = require("./config/mongo");
const { sequelize } = require("./config/db");

const app = express();
connectMongo();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

const cookieParser = require("cookie-parser");
app.use(cookieParser());

// ----- Command Routes -----
const courseCommandRoutes = require("./routes/commands/courseCommandRoutes");
const userCommandRoutes = require("./routes/commands/userCommandRoutes");
const departmentCommandRoutes = require("./routes/commands/departmentCommandRoutes");
const lectureCommandRoutes = require("./routes/commands/lectureCommandRoutes");
const assignmentCommandRoutes = require("./routes/commands/assignmentCommandRoutes");
const authRoutes = require("./routes/commands/authRoutes");

// ----- Query Routes -----
const courseQueryRoutes = require("./routes/queries/courseQueryRoutes");
const userQueryRoutes = require("./routes/queries/userQueryRoutes");
const departmentQueryRoutes = require("./routes/queries/departmentQueryRoutes");
const lectureQueryRoutes = require("./routes/queries/lectureQueryRoutes");
const assignmentQueryRoutes = require("./routes/queries/assignmentQueryRoutes");

// ----- Command APIs (writes to SQL + syncs Mongo) -----
app.use("/api/commands/courses", courseCommandRoutes);
app.use("/api/commands/users", userCommandRoutes);
app.use("/api/commands/departments", departmentCommandRoutes);
app.use("/api/commands/lectures", lectureCommandRoutes);
app.use("/api/commands/assignments", assignmentCommandRoutes);
app.use("/api/auth", authRoutes);

// ----- Query APIs (reads from Mongo) -----
app.use("/api/queries/courses", courseQueryRoutes);
app.use("/api/queries/users", userQueryRoutes);
app.use("/api/queries/departments", departmentQueryRoutes);
app.use("/api/queries/lectures", lectureQueryRoutes);
app.use("/api/queries/assignments", assignmentQueryRoutes);

// ----- Sequelize models (SQL relations setup) -----
require("./models/sql/department");
require("./models/sql/course");
require("./models/sql/lecture");

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);

  try {
    await sequelize.authenticate();
    console.log("✅ SQL Database connected successfully!");
    await sequelize.sync();
    console.log("✅ SQL Database tables created or synced!");
  } catch (error) {
    console.error("❌ Unable to connect to SQL database:", error);
  }
});
