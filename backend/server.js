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
const adminCommandRoutes = require("./routes/commands/adminCommandRoutes");
const teacherCommandRoutes = require("./routes/commands/teacherCommandRoutes");
const studentCommandRoutes = require("./routes/commands/studentCommandRoutes");
const departmentCommandRoutes = require("./routes/commands/departmentCommandRoutes");
const lectureCommandRoutes = require("./routes/commands/lectureCommandRoutes");
const assignmentCommandRoutes = require("./routes/commands/assignmentCommandRoutes");
const examCommandRoutes = require("./routes/commands/examCommandRoutes");
const adminAuthRoutes = require("./routes/commands/adminAuthRoutes");
const teacherAuthRoutes = require("./routes/commands/teacherAuthRoutes");
const studentAuthRoutes = require("./routes/commands/studentAuthRoutes");
const studentCourseRoutes = require("./routes/commands/studentCourseRoutes");


// ----- Query Routes -----
const courseQueryRoutes = require("./routes/queries/courseQueryRoutes");
const adminQueryRoutes = require("./routes/queries/adminQueryRoutes");
const teacherQueryRoutes = require("./routes/queries/teacherQueryRoutes");
const studentQueryRoutes = require("./routes/queries/studentQueryRoutes");
const departmentQueryRoutes = require("./routes/queries/departmentQueryRoutes");
const lectureQueryRoutes = require("./routes/queries/lectureQueryRoutes");
const assignmentQueryRoutes = require("./routes/queries/assignmentQueryRoutes");
const examQueryRoutes = require("./routes/queries/examQueryRoutes");
// ----- Command Routes -----
const uploadCommandRoute = require("./routes/commands/uploadRoutes");
const gradeCommandRoute = require("./routes/commands/gradeRoutes");
const reviewCommandRoute = require("./routes/commands/reviewRoutes");
const attendanceCommandRoute = require("./routes/commands/attendanceRoutes");
const assignmentGradeCommandRoute = require("./routes/commands/assignmentGradeRoutes");
const studentCourseCommandRoute = require("./routes/commands/studentCourseRoutes");
const studentExamCommandRoute = require("./routes/commands/studentExamRoutes");

// ----- Query Routes -----
const uploadQueryRoute = require("./routes/queries/uploadQueryRoutes");
const gradeQueryRoute = require("./routes/queries/gradeQueryRoutes");
const reviewQueryRoute = require("./routes/queries/reviewQueryRoutes");
const attendanceQueryRoute = require("./routes/queries/attendanceQueryRoutes");
const assignmentGradeQueryRoute = require("./routes/queries/assignmentGradeQueryRoutes");
const studentCourseQueryRoute = require("./routes/queries/studentCourseQueryRoutes");
const studentExamQueryRoute = require("./routes/queries/studentExamQueryRoutes");

// ----- Command APIs -----
app.use("/api/commands/upload", uploadCommandRoute);
app.use("/api/commands/grade", gradeCommandRoute);
app.use("/api/commands/review", reviewCommandRoute);
app.use("/api/commands/attendance", attendanceCommandRoute);
app.use("/api/commands/assignment-grade", assignmentGradeCommandRoute);
app.use("/api/commands/student-course", studentCourseCommandRoute);
app.use("/api/commands/student-exam", studentExamCommandRoute);
app.use("/api/commands/student-courses", studentCourseRoutes);

// ----- Query APIs -----
app.use("/api/queries/upload", uploadQueryRoute);
app.use("/api/queries/grade", gradeQueryRoute);
app.use("/api/queries/review", reviewQueryRoute);
app.use("/api/queries/attendance", attendanceQueryRoute);
app.use("/api/queries/assignment-grade", assignmentGradeQueryRoute);
app.use("/api/queries/student-course", studentCourseQueryRoute);
app.use("/api/queries/student-exam", studentExamQueryRoute);

// ----- Command APIs (writes to SQL + syncs Mongo) -----
app.use("/api/commands/courses", courseCommandRoutes);
app.use("/api/commands/admins", adminCommandRoutes);
app.use("/api/commands/teachers", teacherCommandRoutes);
app.use("/api/commands/students", studentCommandRoutes);
app.use("/api/commands/departments", departmentCommandRoutes);
app.use("/api/commands/lectures", lectureCommandRoutes);
app.use("/api/commands/assignments", assignmentCommandRoutes);
app.use("/api/commands/exams", examCommandRoutes);
app.use("/api/auth/admins", adminAuthRoutes);
app.use("/api/auth/teachers", teacherAuthRoutes);
app.use("/api/auth/students", studentAuthRoutes);


// ----- Query APIs (reads from Mongo) -----
app.use("/api/queries/courses", courseQueryRoutes);
app.use("/api/queries/admins", adminQueryRoutes);
app.use("/api/queries/teachers", teacherQueryRoutes);
app.use("/api/queries/students", studentQueryRoutes);
app.use("/api/queries/departments", departmentQueryRoutes);
app.use("/api/queries/lectures", lectureQueryRoutes);
app.use("/api/queries/assignments", assignmentQueryRoutes);
app.use("/api/queries/exams", examQueryRoutes);


// ----- Sequelize models (SQL relations setup) -----
require("./models/sql/department");
require("./models/sql/course");
require("./models/sql/lecture");
require("./models/sql/exam");

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
