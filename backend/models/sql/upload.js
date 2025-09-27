// backend/models/sql/upload.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");
const Lecture = require("./lecture");
const Assignment = require("./assignment");
const Student = require("./student");

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
      { fields: ["studentId"] },
    ],
  }
);

// Associations
Lecture.hasMany(Upload, { foreignKey: "lectureId", onDelete: "CASCADE" });
Upload.belongsTo(Lecture, { foreignKey: "lectureId" });

Assignment.hasMany(Upload, { foreignKey: "assignmentId", onDelete: "CASCADE" });
Upload.belongsTo(Assignment, { foreignKey: "assignmentId" });

Student.hasMany(Upload, { foreignKey: "studentId", onDelete: "CASCADE" });
Upload.belongsTo(Student, { foreignKey: "studentId" });

module.exports = Upload;
