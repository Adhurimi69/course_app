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

Course.hasMany(Lecture, { foreignKey: "courseId", onDelete: "CASCADE" });
Lecture.belongsTo(Course, { foreignKey: "courseId" });

module.exports = Lecture;
