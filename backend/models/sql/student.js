const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");
const bcrypt = require("bcryptjs");

const Student = sequelize.define(
  "Student",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    refreshToken: {
      type: DataTypes.TEXT,
    },
  },
  { timestamps: false }
);

Student.beforeCreate(async (student) => {
  student.password = await bcrypt.hash(student.password, 10);
});

Student.beforeUpdate(async (student) => {
  if (student.changed("password")) {
    student.password = await bcrypt.hash(student.password, 10);
  }
});

module.exports = Student;
