const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");
const Student = require("./student");
const Assignment = require("./assignment");

const AssignmentGrade = sequelize.define("AssignmentGrade", {
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
  assignmentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Assignment,
      key: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  score: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, { timestamps: false });

// Associations
Student.hasMany(AssignmentGrade, { foreignKey: "studentId" });
Assignment.hasMany(AssignmentGrade, { foreignKey: "assignmentId" });

AssignmentGrade.belongsTo(Student, { foreignKey: "studentId" });
AssignmentGrade.belongsTo(Assignment, { foreignKey: "assignmentId" });

module.exports = AssignmentGrade;
