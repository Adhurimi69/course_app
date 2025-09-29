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
    // points (weight/value) for the assignment
    points: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    timestamps: false,
  }
);

Lecture.hasMany(Assignment, {
  foreignKey: "lectureId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Assignment.belongsTo(Lecture, {
  foreignKey: "lectureId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = Assignment;
