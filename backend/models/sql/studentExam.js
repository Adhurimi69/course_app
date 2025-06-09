const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");
const Student = require("./student");
const Exam = require("./exam");

const StudentExam = sequelize.define("StudentExam", {
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Student, key: "id" },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  },
  examId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Exam, key: "id" },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  },
  score: {
    type: DataTypes.FLOAT,
    allowNull: false,
  }
}, { timestamps: false });

Student.hasMany(StudentExam, { foreignKey: "studentId" });
Exam.hasMany(StudentExam, { foreignKey: "examId" });
StudentExam.belongsTo(Student, { foreignKey: "studentId" });
StudentExam.belongsTo(Exam, { foreignKey: "examId" });

module.exports = StudentExam;
