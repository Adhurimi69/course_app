const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const Upload = sequelize.define("Upload", {
  file: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timeUploaded: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, { timestamps: false });

module.exports = Upload;
