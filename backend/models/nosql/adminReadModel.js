const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  adminId: Number,
  name: String,
  email: String,
  role: String,
});

module.exports.AdminReadModel = mongoose.model("AdminReadModel", adminSchema);
