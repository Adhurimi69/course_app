const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Department = require('./Department');
const Exam = require('./Exam');

const Course = sequelize.define('Course', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
});

// Relationships
Department.hasMany(Course, { foreignKey: 'departmentId', onDelete: 'CASCADE' });
Course.belongsTo(Department, { foreignKey: 'departmentId' });

Course.hasMany(Exam, { foreignKey: 'courseId', onDelete: 'CASCADE' });
Exam.belongsTo(Course, { foreignKey: 'courseId' });

module.exports = Course;
