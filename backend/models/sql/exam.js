const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");
const Course = require("./course");

const Exam = sequelize.define(
  "Exam",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

// Define association and let Sequelize handle the courseId FK
Exam.belongsTo(Course, {
  foreignKey: {
    name: "courseId",
    allowNull: false,
  },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = Exam;
