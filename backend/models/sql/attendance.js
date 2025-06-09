const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");
const Student = require("./student");
const Course = require("./course");
const Lecture = require("./lecture");

const Attendance = sequelize.define("Attendance", {
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Student,
      key: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Course,
      key: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  lectureId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Lecture,
      key: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
}, { timestamps: false });

// Associations
Student.hasMany(Attendance, { foreignKey: "studentId" });
Course.hasMany(Attendance, { foreignKey: "courseId" });
Lecture.hasMany(Attendance, { foreignKey: "lectureId" });

Attendance.belongsTo(Student, { foreignKey: "studentId" });
Attendance.belongsTo(Course, { foreignKey: "courseId" });
Attendance.belongsTo(Lecture, { foreignKey: "lectureId" });

module.exports = Attendance;
