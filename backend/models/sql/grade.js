const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");
const Student = require("./student");
const Course = require("./course");

const Grade = sequelize.define("Grade", {
  studentId: {
    type: DataTypes.INTEGER,
    references: { model: Student, key: "id" },
    allowNull: false,
  },
  courseId: {
    type: DataTypes.INTEGER,
    references: { model: Course, key: "id" },
    allowNull: false,
  },
  score: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, { timestamps: false });

Student.hasMany(Grade, { foreignKey: 'studentId' });
Course.hasMany(Grade, { foreignKey: 'courseId' });
Grade.belongsTo(Student, { foreignKey: 'studentId' });
Grade.belongsTo(Course, { foreignKey: 'courseId' });

module.exports = Grade;
