const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: Number,
  name: String,
  email: String,
  role: String,
});

module.exports.UserReadModel = mongoose.model("UserReadModel", userSchema);
