const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");
const Department = require("./department");

const Course = sequelize.define(
  "Course",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

// Lidhjet me onDelete/onUpdate të plotë
Department.hasMany(Course, {
  foreignKey: "departmentId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Course.belongsTo(Department, {
  foreignKey: "departmentId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = Course;
