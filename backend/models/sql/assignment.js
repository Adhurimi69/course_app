const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");
const Lecture = require("./lecture");

const Assignment = sequelize.define(
  "Assignment",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

Lecture.hasMany(Assignment, { foreignKey: "lectureId", onDelete: "CASCADE" });
Assignment.belongsTo(Lecture, { foreignKey: "lectureId" });

module.exports = Assignment;
