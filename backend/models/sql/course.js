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
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    enrollment_key: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

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
