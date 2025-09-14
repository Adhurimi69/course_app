const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");
const Student = require("./student");
const Course = require("./course");

const StudentCourse = sequelize.define("StudentCourse", {
  studentId: {
    type: DataTypes.INTEGER,
    references: {
      model: Student,
      key: "id",
    },
    allowNull: false,
  },
  courseId: {
    type: DataTypes.INTEGER,
    references: {
      model: Course,
      key: "id",
    },
    allowNull: false,
  },
  enrollmentKey: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, { timestamps: false });


Student.belongsToMany(Course, { through: StudentCourse, foreignKey: 'studentId' });
Course.belongsToMany(Student, { through: StudentCourse, foreignKey: 'courseId' });

StudentCourse.belongsTo(Course, { foreignKey: 'courseId' });
StudentCourse.belongsTo(Student, { foreignKey: 'studentId' });

module.exports = StudentCourse;
