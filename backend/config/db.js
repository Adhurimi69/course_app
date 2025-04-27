const { Sequelize } = require('sequelize');

// Replace these with your own database credentials
const sequelize = new Sequelize('course_app', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = { sequelize };
