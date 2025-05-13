const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");
const bcrypt = require("bcryptjs");

const Teacher = sequelize.define(
  "Teacher",
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

Teacher.beforeCreate(async (teacher) => {
  teacher.password = await bcrypt.hash(teacher.password, 10);
});

Teacher.beforeUpdate(async (teacher) => {
  if (teacher.changed("password")) {
    teacher.password = await bcrypt.hash(teacher.password, 10);
  }
});

module.exports = Teacher;
