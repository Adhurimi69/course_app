const Department = require("./department");
const Course = require("./course");
const Lecture = require("./lecture");
const Assignment = require("./assignment");
const { sequelize } = require("../../config/db");

// As associations are already defined in the individual models,
// just syncing here is enough
sequelize
  .sync({ alter: true }) // ose { force: true } për dev
  .then(() => {
    console.log("Database tables created or synced!");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

module.exports = {
  Department,
  Course,
  Lecture,
  Assignment,
};
