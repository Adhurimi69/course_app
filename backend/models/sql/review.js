const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");
const Student = require("./student");
const Course = require("./course");

const Review = sequelize.define("Review", {
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
  rating: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, { timestamps: false });

Student.hasMany(Review, { foreignKey: 'studentId' });
Course.hasMany(Review, { foreignKey: 'courseId' });
Review.belongsTo(Student, { foreignKey: 'studentId' });
Review.belongsTo(Course, { foreignKey: 'courseId' });

module.exports = Review;
