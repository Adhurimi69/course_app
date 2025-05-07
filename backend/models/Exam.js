const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Exam = sequelize.define('Exam', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  timestamps: true,
});

module.exports = Exam;
