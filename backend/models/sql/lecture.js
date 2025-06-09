const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");
const Course = require("./course");

const Lecture = sequelize.define(
  "Lecture",
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

// Lidhjet me onDelete/onUpdate kaskadë
Course.hasMany(Lecture, {
  foreignKey: "courseId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Lecture.belongsTo(Course, {
  foreignKey: "courseId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = Lecture;
