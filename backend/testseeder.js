// testSeeder.js
const connectMongo = require("./config/mongo");
const { sequelize } = require("./config/db");

const { createAdmin } = require("./controllers/commands/adminCommandController");
const { createStudent } = require("./controllers/commands/studentCommandController");
const { createTeacher } = require("./controllers/commands/teacherCommandController");
//test comment
// Mocked request/response for testing
const mockReqRes = (body) => {
  const req = { body };
  const res = {
    status: (code) => ({
      json: (data) => console.log(`✅ [${code}]`, data),
    }),
    json: (data) => console.log("✅", data),
  };
  return [req, res];
};

(async () => {
  try {
    await sequelize.sync({ force: false });
    await connectMongo();

    const [adminReq, adminRes] = mockReqRes({
      name: "Test Admin",
      email: "admin@test.com",
      password: "admin123",
      role: "admin",
    });

    const [studentReq, studentRes] = mockReqRes({
      name: "Test Student",
      email: "student@test.com",
      password: "student123",
      role: "student",
    });

    const [teacherReq, teacherRes] = mockReqRes({
      name: "Test Teacher",
      email: "teacher@test.com",
      password: "teacher123",
      role: "teacher",
    });

    await createAdmin(adminReq, adminRes);
    await createStudent(studentReq, studentRes);
    await createTeacher(teacherReq, teacherRes);

    console.log("🎉 Test users created.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
})();
