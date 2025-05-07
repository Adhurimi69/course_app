const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  departmentId: Number,
  name: String,
});

module.exports.DepartmentReadModel = mongoose.model(
  "DepartmentReadModel",
  departmentSchema
);
