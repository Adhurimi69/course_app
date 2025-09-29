// backend/models/sql/upload.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");
const Lecture = require("./lecture");
const Assignment = require("./assignment");
const Student = require("./student");
const Teacher = require("./teacher");

const Upload = sequelize.define(
  "Upload",
  {
    file: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timeUploaded: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    lectureId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    assignmentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    examId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    indexes: [
      { fields: ["lectureId"] },
      { fields: ["assignmentId"] },
        { fields: ["examId"] },
      { fields: ["teacherId"] },
      { fields: ["studentId"] },
    ],
  }
);

// Associations
Lecture.hasMany(Upload, { foreignKey: "lectureId", onDelete: "CASCADE" });
Upload.belongsTo(Lecture, { foreignKey: "lectureId" });

Assignment.hasMany(Upload, { foreignKey: "assignmentId", onDelete: "CASCADE" });
Upload.belongsTo(Assignment, { foreignKey: "assignmentId" });

// Exam association (uploads linked to exams such as exam resources)
const Exam = require("./exam");
Exam.hasMany(Upload, { foreignKey: "examId", onDelete: "CASCADE" });
Upload.belongsTo(Exam, { foreignKey: "examId" });

Student.hasMany(Upload, { foreignKey: "studentId", onDelete: "CASCADE" });
Upload.belongsTo(Student, { foreignKey: "studentId" });

// Teacher association (for teacher-uploaded resources)
Teacher.hasMany(Upload, { foreignKey: "teacherId", onDelete: "CASCADE" });
Upload.belongsTo(Teacher, { foreignKey: "teacherId" });

module.exports = Upload;
