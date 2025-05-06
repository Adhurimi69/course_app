const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Department = require('./Department');

const Course = sequelize.define('Course', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
});

Department.hasMany(Course, { foreignKey: 'departmentId', onDelete: 'CASCADE' });
Course.belongsTo(Department, { foreignKey: 'departmentId' });

module.exports = Course;
